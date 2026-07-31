import express from "express";
import cors from "cors";

import { logger } from "./config/logger";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/api", routes);

export default app;