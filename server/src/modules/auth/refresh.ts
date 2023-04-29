import { Request, Response } from "express";
import { config } from "../../config";
import * as RefreshTokens from "../../services/refreshTokens";
import { getAccessToken, getRefreshToken } from "../../services/tokens";

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const { refresh } = req.cookies;
    if (!refresh) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_TOKEN",
      });
    }
    const entry = await RefreshTokens.find(refresh);
    if (!entry) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_TOKEN",
      });
    }
    await RefreshTokens.remove(refresh);
    const { userId } = entry;
    const refreshToken = getRefreshToken(userId);
    await RefreshTokens.add(refreshToken, userId);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: getAccessToken(userId),
      });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "SOMETHING_WENT_WRONG",
      details: JSON.stringify(err),
    });
  }
};
