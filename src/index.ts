import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import {
  IpAddressRoot,
  IpAddressRouter,
} from "./ip-address/ip-addres-controller";
import { morganMiddleware } from "./middleware/morgan-middleware";

const app = express()
  .use(helmet())
  .use(bodyParser.json())
  .use(cors())
  .use(morganMiddleware)
  .use(IpAddressRoot, IpAddressRouter);

app.listen(3030, () => {
  console.log("Server started");
});
