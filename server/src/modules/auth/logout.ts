import { Request, Response } from "express";
import * as RefreshTokens from "../../services/refreshTokens";

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const { refresh } = req.cookies;
    if (!(await RefreshTokens.find(refresh))) {
      return res.status(400).json({
        status: "Error",
        message: "MISSING_TOKEN",
      });
    }
    await RefreshTokens.remove(refresh);
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
};
