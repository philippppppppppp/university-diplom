import { Request, Response } from "express";
import { getUserById, activateUser } from "../../services/users";
import { sendActivationToken } from "../../services/emailService";
import {
  decodeToken,
  getActivationToken,
  verifyActivationToken,
} from "../../services/tokens";

export const activationHandler = async (req: Request, res: Response) => {
  try {
    const { activationToken } = req.body;
    let payload;
    try {
      payload = verifyActivationToken(activationToken);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        const { id } = decodeToken(activationToken);
        if (!id) {
          return res.status(400).json({
            status: "Error",
            message: "INVALID_ACTIVATION_TOKEN",
          });
        }
        const newToken = getActivationToken(id);
        await sendActivationToken(newToken);
        return res.status(400).json({
          status: "Error",
          message: "ACTIVATION_TOKEN_EXPIRED",
        });
      }
      return res.status(400).json({
        status: "Error",
        message: "INVALID_ACTIVATION_TOKEN",
      });
    }
    const { id } = payload;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_ACTIVATION_TOKEN",
      });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_ACTIVATION_TOKEN",
      });
    }
    if (user.activated) {
      return res.status(400).json({
        status: "Error",
        message: "USER_ALREADY_ACTIVATED",
      });
    }
    await activateUser(id);
    return res.status(200).json({
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
