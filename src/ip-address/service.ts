import Logger from "../middleware/logger";
import {
  getCountryFromMemory as lookupIpAddressFromMemory,
  saveCountryToMemory as saveIpAddresslookupToMemory,
} from "./memory";
import { getFromPrimaryVendor, getFromSecondaryVendor } from "./api-client";
import { ApiResponse } from "./models";

// TODO: There are more stricter/better variants
// Source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
export const isValidIpAddress = (ipAddress: string): boolean =>
  ipAddressRegex.test(ipAddress);

export const lookupIpAddress = async (
  ipAddress: string
): Promise<ApiResponse> => {
  const cachedLookup = lookupIpAddressFromMemory(ipAddress);
  if (cachedLookup !== undefined) return { lookup: cachedLookup };

  Logger.info("Cache miss");

  const primaryLookup = await getFromPrimaryVendor(ipAddress);
  if (primaryLookup.lookup) {
    saveIpAddresslookupToMemory(ipAddress, primaryLookup.lookup);
    return primaryLookup;
  }

  Logger.info("Primary vendor miss");

  const secondaryLookup = await getFromSecondaryVendor(ipAddress);
  if (secondaryLookup.lookup) {
    saveIpAddresslookupToMemory(ipAddress, secondaryLookup.lookup);
  } else {
    Logger.info("Secondary vendor miss");
  }

  return secondaryLookup;
};
