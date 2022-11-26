import { Router, Request, Response, NextFunction } from "express";
import { lookupIpAddress, isValidIpAddress } from "./service";
import { constants } from "http2";

const countryRoute = "/:ipAddress/country";
const country = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const ipAddress = request.params.ipAddress;

    if (!isValidIpAddress(ipAddress)) {
      return response.status(constants.HTTP_STATUS_BAD_REQUEST).send();
    }

    const apiResponse = await lookupIpAddress(ipAddress);
    if (apiResponse.rateLimited) {
      return response.status(constants.HTTP_STATUS_TOO_MANY_REQUESTS).send();
    }

    if (apiResponse.apiError) {
      return response
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send();
    }

    return response
      .status(constants.HTTP_STATUS_OK)
      .json(apiResponse.lookup)
      .send();
  } catch (e) {
    next(e);
  }
};

export const IpAddressRoot = "/ipAddress";
export const IpAddressRouter = Router().get(countryRoute, country);
