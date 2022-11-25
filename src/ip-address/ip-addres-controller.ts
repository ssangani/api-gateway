import { Router, Request, Response } from "express";
import { isValidIpAddress } from "./ip-address-service";

const countryRoute = "/:ipAddress/country";
const country = async (request: Request, response: Response) => {
  const ipAddress = request.params.ipAddress;

  if (!isValidIpAddress(ipAddress)) {
    return response.status(400).send();
  }

  response.sendStatus(200);
};

export const IpAddressRoot = "/ipAddress";
export const IpAddressRouter = Router().get(countryRoute, country);
