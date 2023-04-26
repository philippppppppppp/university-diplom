import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { getUserByEmail } from "./api";
import * as RefreshTokens from "./refreshTokens";

const port = process.env.PORT ?? 8000;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? "";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? "";

const saltRounds = 10;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/api/auth/register", async (req, res) => {
  res.status(501).json({ status: "Error", message: "NOT_IMPLEMENTED" });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_CREDENTIALS",
      });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_CREDENTIALS",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_CREDENTIALS",
      });
    }
    const refreshToken = jwt.sign({ id: user.id }, jwtRefreshSecret, {
      expiresIn: "2w",
    });
    RefreshTokens.add(refreshToken, user.id);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: user.id }, jwtAccessSecret, { expiresIn: "5m" }),
      });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "SOMETHING_WENT_WRONG",
      details: JSON.stringify(err),
    });
  }
});

app.post("/api/auth/refresh", (req, res) => {
  try {
    const { refresh } = req.cookies;
    if (!refresh) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_TOKEN",
      });
    }
    const entry = RefreshTokens.find(refresh);
    if (!entry) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_TOKEN",
      });
    }
    RefreshTokens.remove(refresh);
    const { userId } = entry;
    const refreshToken = jwt.sign({ id: userId }, jwtRefreshSecret, {
      expiresIn: "2w",
    });
    RefreshTokens.add(refreshToken, userId);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: userId }, jwtAccessSecret, { expiresIn: "5m" }),
      });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "SOMETHING_WENT_WRONG",
      details: JSON.stringify(err),
    });
  }
});

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

app.listen(port, () => {
  console.log("Server is listening port", port);
});
