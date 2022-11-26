import { NextFunction, Request, Response } from "express";
import Logger from "./logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err);
  res.status(500).send("Ruh Roh!");
};
