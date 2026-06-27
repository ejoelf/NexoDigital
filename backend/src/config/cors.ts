import type { CorsOptions } from "cors";
import { env } from "./env.js";

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.length === 0) {
      callback(null, true);
      return;
    }

    callback(null, env.corsOrigins.includes(origin));
  },
  credentials: true,
};
