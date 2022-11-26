import Logger from "../middleware/logger";

export const getFromPrimaryVendor = async (
  ipAddress: string
): Promise<string | null> => {
  try {
    const url = `http://xip-api.com/json/${ipAddress}`;
    const response = await fetch(url);

    if (response.status !== 200) return null;

    const data = await response.json();
    return data["country"];
  } catch (e) {
    Logger.error("Error while fetching country using IP API", e);
    return null;
  }
};

export const getFromSecondaryVendor = async (
  ipAddress: string
): Promise<string | null> => {
  try {
    const url = `https://xipapi.co/${ipAddress}/json`;
    const response = await fetch(url);

    if (response.status !== 200) return null;

    const data = await response.json();
    return data["country_name"];
  } catch (e) {
    Logger.error("Error while fetching country using IP API", e);
    return null;
  }
};
