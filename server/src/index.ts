import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import * as RefreshTokens from "./services/refreshTokens";
import { config } from "./config";
import { router } from "./modules";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.post("/api/auth/logout", (req, res) => {
  try {
    const { refresh } = req.cookies;
    if (!RefreshTokens.find(refresh)) {
      return res.status(400).json({
        status: "Error",
        message: "MISSING_TOKEN",
      });
    }
    RefreshTokens.remove(refresh);
    res.status(200).clearCookie("refresh", { path: "/api/auth" }).json({
      status: "OK",
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "SOMETHING_WENT_WRONG",
      details: JSON.stringify(err),
    });
  }
});

app.listen(config.port, () => {
  console.log("Server is listening port", config.port);
});
