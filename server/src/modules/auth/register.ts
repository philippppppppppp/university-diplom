import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { config } from "../../config";
import {
  getUserByEmail,
  getUserByPhone,
  insertUser,
} from "../../services/users";
import { sendActivationToken } from "../../services/emailService";
import { getActivationToken } from "../../services/tokens";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, name, password, phone } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !name ||
      typeof name !== "string" ||
      !password ||
      typeof password !== "string" ||
      !phone ||
      typeof phone !== "string"
    ) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_REGISTER_DATA",
      });
    }
    const transformedEmail = email.toLowerCase();
    const userByEmail = await getUserByEmail(transformedEmail);
    if (userByEmail) {
      return res.status(400).json({
        status: "Error",
        message: "EMAIL_ALREADY_REGISTERED",
      });
    }
    const userByPhone = await getUserByPhone(phone);
    if (userByPhone) {
      return res.status(400).json({
        status: "Error",
        message: "PHONE_ALREADY_REGISTERED",
      });
    }
    const hashedPassword = bcrypt.hashSync(
      password,
      config.passwordEncryptionRounds
    );
    const { id } = await insertUser(
      transformedEmail,
      hashedPassword,
      name,
      phone
    );
    const activationToken = getActivationToken(id);
    await sendActivationToken(activationToken);
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
