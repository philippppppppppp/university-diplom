import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { getUserByEmail } from "../../services/users";
import * as RefreshTokens from "../../services/refreshTokens";

export const loginHandler = async (req: Request, res: Response) => {
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
    if (!user.activated) {
      return res.status(400).json({
        status: "Error",
        message: "NOT_ACTIVATED",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_CREDENTIALS",
      });
    }
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, {
      expiresIn: config.jtwRefreshExpires,
    });
    RefreshTokens.add(refreshToken, user.id);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: user.id }, config.jwtAccessSecret, {
          expiresIn: config.jtwAccessExpires,
        }),
      });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "SOMETHING_WENT_WRONG",
      details: JSON.stringify(err),
    });
  }
};
