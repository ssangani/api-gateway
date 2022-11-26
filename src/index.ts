import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { IpAddressRoot, IpAddressRouter } from "./ip-address/controller";
import { morganMiddleware } from "./middleware/morgan-middleware";
import { errorHandler } from "./middleware/error-handler";
import Logger from "./middleware/logger";
import { exit } from "process";

const app = express()
  .use(helmet())
  .use(bodyParser.json())
  .use(cors())
  .use(morganMiddleware)
  .use(IpAddressRoot, IpAddressRouter)
  .use(errorHandler);

app.listen(3030, () => {
  console.log("Server started");
});

process.on("uncaughtException", (err) => {
  Logger.error("Uncaught exception", err);
  exit(1);
});
