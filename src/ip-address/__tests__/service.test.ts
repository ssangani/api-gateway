import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { lookupIpAddress, isValidIpAddress } from "../service";
import { saveCountryToMemory, getCountryFromMemory } from "../memory";
import { getFromPrimaryVendor, getFromSecondaryVendor } from "../api-client";
import { ApiResponse, IpAddressLookup } from "../models";

// Mock dependencies
jest.mock("../memory");
jest.mock("../api-client");

const saveCountryToMemoryMock = saveCountryToMemory as jest.MockedFunction<
  typeof saveCountryToMemory
>;
const getCountryFromMemoryMock = getCountryFromMemory as jest.MockedFunction<
  typeof getCountryFromMemory
>;
const getFromPrimaryVendorMock = getFromPrimaryVendor as jest.MockedFunction<
  typeof getFromPrimaryVendor
>;
const getFromSecondaryVendorMock =
  getFromSecondaryVendor as jest.MockedFunction<typeof getFromSecondaryVendor>;

// Test Suites
describe("isValidIpAddress", () => {
  it.each`
    ipAddress            | expected
    ${"10.10.10.10"}     | ${true}
    ${"255.255.255.255"} | ${true}
    ${"127.0.0.1"}       | ${true}
    ${"192.168.0.1"}     | ${true}
    ${"255.255.255"}     | ${false}
    ${"127:0:0:1"}       | ${false}
    ${null}              | ${false}
    ${""}                | ${false}
  `(
    "When IP Address is $ipAddress then it validates to $expected",
    ({ ipAddress, expected }) => {
      expect(isValidIpAddress(ipAddress as string)).toBe(expected);
    }
  );
});

describe("getCountry", () => {
  // Reset mocks
  beforeEach(() => {
    getCountryFromMemoryMock.mockReset();
    getFromPrimaryVendorMock.mockReset();
    getFromSecondaryVendorMock.mockReset();
    saveCountryToMemoryMock.mockReset();
  });

  it("cache hit doesn't result in API call", async () => {
    // Arrange
    const lookup: IpAddressLookup = {
      country: "United States",
    };
    const expected: ApiResponse = {
      lookup,
    };

    getCountryFromMemoryMock.mockReturnValue(lookup);

    // Act
    const actual = await lookupIpAddress("10:10:10:10");

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(0);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(0);
  });

  it("cache miss results in data being fetched from primary API", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const lookup: IpAddressLookup = {
      country: "United States",
    };
    const expected: ApiResponse = {
      lookup,
    };

    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await lookupIpAddress(ipAddress);

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledWith(ipAddress, lookup);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(0);
  });

  it("cache miss and primary API rate limit results in data being fetched from secondary API", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const lookup: IpAddressLookup = {
      country: "United States",
    };
    const expected: ApiResponse = {
      lookup,
    };

    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(
      Promise.resolve({ rateLimited: true })
    );
    getFromSecondaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await lookupIpAddress(ipAddress);

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledWith(ipAddress, lookup);
  });

  it("cache miss and primary API error results in data being fetched from secondary API", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const lookup: IpAddressLookup = {
      country: "United States",
    };
    const expected: ApiResponse = {
      lookup,
    };

    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(
      Promise.resolve({ apiError: true })
    );
    getFromSecondaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await lookupIpAddress(ipAddress);

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledWith(ipAddress, lookup);
  });

  it("cache miss, primary API failure & secondary API rate limit shouldn't save data to cache", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const expected: ApiResponse = {
      rateLimited: true,
    };

    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(
      Promise.resolve({ apiError: true })
    );
    getFromSecondaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await lookupIpAddress(ipAddress);

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(0);
  });

  it("cache miss, primary API failure & secondary API failure shouldn't save data to cache", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const expected: ApiResponse = {
      apiError: true,
    };

    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(
      Promise.resolve({ apiError: true })
    );
    getFromSecondaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await lookupIpAddress(ipAddress);

    // Assert
    expect(actual).toStrictEqual(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(0);
  });
});
