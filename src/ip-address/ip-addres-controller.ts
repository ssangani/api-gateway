import { Router, Request, Response } from "express";
import { getCountry, isValidIpAddress } from "./ip-address-service";
import { constants } from "http2";

const countryRoute = "/:ipAddress/country";
const country = async (request: Request, response: Response) => {
  const ipAddress = request.params.ipAddress;

  if (!isValidIpAddress(ipAddress)) {
    return response.status(constants.HTTP_STATUS_BAD_REQUEST).send();
  }

  const country = await getCountry(ipAddress);
  if (country == null) {
    return response.status(constants.HTTP_STATUS_TOO_MANY_REQUESTS).send();
  }

  return response
    .status(constants.HTTP_STATUS_OK)
    .json({
      country: country,
    })
    .send();
};

export const IpAddressRoot = "/ipAddress";
export const IpAddressRouter = Router().get(countryRoute, country);
