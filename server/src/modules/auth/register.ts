import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { getUserByEmail, insertUser } from "../../services/users";
import { sendActivationToken } from "../../services/emailService";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !name ||
      typeof name !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        status: "Error",
        message: "INVALID_REGISTER_DATA",
      });
    }
    const transformedEmail = email.toLowerCase();
    const user = await getUserByEmail(transformedEmail);
    if (user) {
      return res.status(400).json({
        status: "Error",
        message: "EMAIL_ALREADY_REGISTERED",
      });
    }
    const hashedPassword = bcrypt.hashSync(
      password,
      config.passwordEncryptionRounds
    );
    const { id } = await insertUser(transformedEmail, hashedPassword, name);
    const activationToken = jwt.sign({ id }, config.accountActivationSecret, {
      expiresIn: config.accountActivationExpires,
    });
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
