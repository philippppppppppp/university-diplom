import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import * as RefreshTokens from "../../services/refreshTokens";

export const refreshHandler = (req: Request, res: Response) => {
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
    const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, {
      expiresIn: config.jtwRefreshExpires,
    });
    RefreshTokens.add(refreshToken, userId);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: userId }, config.jwtAccessSecret, {
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
