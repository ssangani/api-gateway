import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import axios from "axios";
import { getFromPrimaryVendor, getFromSecondaryVendor } from "../api-client";

// Mock dependencies
jest.mock("../../middleware/app-config", () => ({
  appConfig: {
    environment: "development",
    morgan: {
      format: "dev",
    },
    api: {
      primary: {
        rateLimit: 1,
      },
      seconday: {
        rateLimit: 1,
      },
    },
  },
}));

jest.mock("axios");
const axiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

beforeEach(() => {
  axiosGet.mockReset();
});

// Test Suites
describe("Primary API lookup", () => {
  test("Rate limiting", async () => {
    // Arrange
    const mockedLookup = {
      status: "success",
      country: "Atlantis",
      countryCode: "OC7",
    };

    axiosGet.mockResolvedValue({
      status: 200,
      data: mockedLookup,
    });

    const ipAddress = "8.8.8.8";
    const expected = {
      country: mockedLookup.country,
    };

    // Act + Assert
    // With rate limit configured to 1:
    // - first attempt should return correct data
    // - consecutive attempts should trigger rate limit
    let response;
    response = await getFromPrimaryVendor(ipAddress);

    expect(response.lookup).toStrictEqual(expected);
    expect(response.apiError).toBeUndefined();
    expect(response.rateLimited).toBeUndefined();

    response = await getFromPrimaryVendor(ipAddress);
    expect(response.lookup).toBeUndefined();
    expect(response.apiError).toBeUndefined();
    expect(response.rateLimited).toBe(true);
  });
});

// Test Suites
describe("Secondary API lookup", () => {
  test("Rate limiting", async () => {
    // Arrange
    const mockedLookup = {
      country: "Atlantis",
      country_code: "OC7",
    };

    axiosGet.mockResolvedValue({
      status: 200,
      data: mockedLookup,
    });

    const ipAddress = "8.8.8.8";
    const expected = {
      country: mockedLookup.country,
    };

    // Act + Assert
    // With rate limit configured to 1:
    // - first attempt should return correct data
    // - consecutive attempts should trigger rate limit
    let response;
    response = await getFromSecondaryVendor(ipAddress);

    expect(response.lookup).toStrictEqual(expected);
    expect(response.apiError).toBeUndefined();
    expect(response.rateLimited).toBeUndefined();

    response = await getFromPrimaryVendor(ipAddress);
    expect(response.lookup).toBeUndefined();
    expect(response.apiError).toBeUndefined();
    expect(response.rateLimited).toBe(true);
  });
});
