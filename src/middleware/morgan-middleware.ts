import morgan, { StreamOptions } from "morgan";
import Logger from "./logger";

const stream: StreamOptions = {
  write: (message: string) => Logger.http(message),
};
const logFormat: string = process.env.LOG_FORMAT || "dev";

export const morganMiddleware = morgan(logFormat, { stream });
