import { RateLimiter } from "limiter";
import Logger from "../middleware/logger";

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
): Promise<string | null> => {
  try {
    const remainingTokens = await primaryVendorRateLimiter.removeTokens(1);
    if (remainingTokens < 0) {
      Logger.warn("Rate limiting calls to primary vendor");
      return null;
    }

    const url = `http://ip-api.com/json/${ipAddress}`;
    const response = await fetch(url);

    if (response.status !== 200) return null;

    const data = await response.json();
    return data["country"];
  } catch (e) {
    Logger.error("Error while fetching country using IP API", e);
    return null;
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
): Promise<string | null> => {
  try {
    const remainingTokens = await secondaryVendorRateLimiter.removeTokens(1);
    if (remainingTokens < 0) {
      Logger.warn("Rate limiting calls to secondary vendor");
      return null;
    }

    const url = `https://ipapi.co/${ipAddress}/json`;
    const response = await fetch(url);

    if (response.status !== 200) return null;

    const data = await response.json();
    return data["country_name"];
  } catch (e) {
    Logger.error("Error while fetching country using IP API", e);
    return null;
  }
};
