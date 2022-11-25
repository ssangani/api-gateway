import morgan, { StreamOptions } from "morgan";

const streamOptions: StreamOptions = {
  write: (message: string) => console.log(message),
};
const logFormat: string = process.env.LOG_FORMAT || "dev";

export const morganMiddleware = morgan(logFormat, { streamOptions });
