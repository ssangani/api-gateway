// TODO: There are more stricter/better variants

import Logger from "../middleware/logger";
import { getCountryFromMemory, saveCountryToMemory } from "./ip-address-memory";
import { getFromPrimaryVendor, getFromSecondaryVendor } from "./ip-api-client";

// Source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
export const isValidIpAddress = (ipAddress: string): boolean =>
  ipAddressRegex.test(ipAddress);

export const getCountry = async (ipAddress: string): Promise<string | null> => {
  try {
    const cachedCountry = getCountryFromMemory(ipAddress);
    if (cachedCountry !== undefined) return cachedCountry;

    Logger.info("Cache miss");

    let country: string | null;
    country = await getFromPrimaryVendor(ipAddress);
    if (country !== null) {
      saveCountryToMemory(ipAddress, country);
      return country;
    }

    Logger.info("Primary vendor miss");

    country = await getFromSecondaryVendor(ipAddress);
    if (country !== null) {
      saveCountryToMemory(ipAddress, country);
    } else {
      Logger.info("IP API miss");
    }

    return country;
  } catch (e) {
    Logger.error("Error while retrieving country", e);
    return null;
  }
};
