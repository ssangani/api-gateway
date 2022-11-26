import { RateLimiter } from "limiter";
import Logger from "../middleware/logger";
import { ApiResponse, IpAddressLookup } from "./models";

const DEFAULT_PRIMARY_VENDOR_RATE_LIMIT = 10;
const primaryVendorRateLimit = (): number => {
  const limit = parseInt(process.env.PRIMARY_VENDOR_RATE_LIMIT || "");
  return isNaN(limit) ? DEFAULT_PRIMARY_VENDOR_RATE_LIMIT : limit;
};
const primaryVendorRateLimiter = new RateLimiter({
  tokensPerInterval: primaryVendorRateLimit(),
  interval: "hour",
  fireImmediately: true,
});

export const getFromPrimaryVendor = async (
  ipAddress: string
): Promise<ApiResponse> => {
  try {
    const remainingTokens = await primaryVendorRateLimiter.removeTokens(1);
    if (remainingTokens < 0) {
      Logger.warn("Rate limiting calls to primary vendor");
      return {
        rateLimited: true,
      };
    }

    const url = `http://ip-api.com/json/${ipAddress}`;
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(
        `Unable to retrieve data for ${ipAddress}: ${response.statusText}`
      );
    }

    const data = await response.json();
    const lookup: IpAddressLookup = {
      country: data["country"],
    };
    return {
      lookup,
    };
  } catch (e) {
    Logger.error("Error while fetching country using IP API: ", e);
    return {
      apiError: true,
    };
  }
};

const DEFAULT_SECONDARY_VENDOR_RATE_LIMIT = 10;
const secondaryVendorRateLimit = (): number => {
  const limit = parseInt(process.env.SECONDARY_VENDOR_RATE_LIMIT || "");
  return isNaN(limit) ? DEFAULT_SECONDARY_VENDOR_RATE_LIMIT : limit;
};
const secondaryVendorRateLimiter = new RateLimiter({
  tokensPerInterval: secondaryVendorRateLimit(),
  interval: "hour",
  fireImmediately: true,
});

export const getFromSecondaryVendor = async (
  ipAddress: string
): Promise<ApiResponse> => {
  try {
    const remainingTokens = await secondaryVendorRateLimiter.removeTokens(1);
    if (remainingTokens < 0) {
      Logger.warn("Rate limiting calls to secondary vendor");
      return {
        rateLimited: true,
      };
    }

    const url = `https://ipapi.co/${ipAddress}/json`;
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(
        `Unable to retrieve data for ${ipAddress}: ${response.statusText}`
      );
    }

    const data = await response.json();
    const lookup: IpAddressLookup = {
      country: data["country_name"],
    };
    return {
      lookup,
    };
  } catch (e) {
    Logger.error("Error while fetching country using IP API: ", e);
    return {
      apiError: true,
    };
  }
};
