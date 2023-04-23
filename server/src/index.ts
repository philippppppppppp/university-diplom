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

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
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
        message: "Missing email and/or password fiels",
      });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "Wrong email or password",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        status: "Error",
        message: "Wrong email or password",
      });
    }
    const refreshToken = jwt.sign({ id: user.id }, jwtRefreshSecret, {
      expiresIn: "2w",
    });
    RefreshTokens.add(refreshToken, user.id);
    return res
      .status(400)
      .cookie("refresh", refreshToken)
      .json({
        status: "Logged In",
        token: jwt.sign({ id: user.id }, jwtAccessSecret, { expiresIn: "5m" }),
      });
  } catch (err) {
    res.status(200).json({
      status: "Error",
      message: "Something went wrong",
      details: JSON.stringify(err),
    });
  }
});

app.post("/refresh", () => {});

app.listen(port, () => {
  console.log("Server is listening port", port);
});
