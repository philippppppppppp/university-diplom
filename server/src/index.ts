import express from "express";
import cors from "cors";
import { config } from "./config";
import { router } from "./modules";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use("/api", router);

app.listen(config.port, () => {
  console.log("Server is listening port", config.port);
});
