import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { getCountry, isValidIpAddress } from "../ip-address-service";
import {
  saveCountryToMemory,
  getCountryFromMemory,
} from "../ip-address-memory";
import { getFromPrimaryVendor, getFromSecondaryVendor } from "../ip-api-client";

// Mock dependencies
jest.mock("../ip-address-memory");
jest.mock("../ip-api-client");

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
    const expected = "United States";
    getCountryFromMemoryMock.mockReturnValue(expected);

    // Act
    const actual = await getCountry("10:10:10:10");

    // Assert
    expect(actual).toBe(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(0);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(0);
  });

  it("cache miss results in data being fetched from primary API", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const expected = "United States";
    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await getCountry(ipAddress);

    // Assert
    expect(actual).toBe(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledWith(ipAddress, expected);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(0);
  });

  it("cache miss and primary API miss results in data being fetched from secondary API", async () => {
    // Arrange
    const ipAddress = "10:10:10:10";
    const expected = "United States";
    getCountryFromMemoryMock.mockReturnValue(undefined);
    getFromPrimaryVendorMock.mockReturnValue(Promise.resolve(null));
    getFromSecondaryVendorMock.mockReturnValue(Promise.resolve(expected));

    // Act
    const actual = await getCountry(ipAddress);

    // Assert
    expect(actual).toBe(expected);
    expect(getCountryFromMemory).toBeCalledTimes(1);
    expect(getFromPrimaryVendor).toBeCalledTimes(1);
    expect(getFromSecondaryVendor).toHaveBeenCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledTimes(1);
    expect(saveCountryToMemory).toBeCalledWith(ipAddress, expected);
  });
});
