import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { activateUser, getUserByEmail, getUserById, insertUser } from "./api";
import * as RefreshTokens from "./refreshTokens";

const port = process.env.PORT ?? 8000;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? "myjwtsecretkey";
const jtwAccessExpires = process.env.JWT_ACCESS_EXPIRES ?? "5m";
const jwtRefreshSecret =
  process.env.JWT_REFRESH_SECRET ?? "myrefreshjwtsecretkey";
const jtwRefreshExpires = process.env.JWT_ACCESS_EXPIRES ?? "2w";
const accountActivationTokenSecret =
  process.env.ACCOUNT_ACTIVATION_SECRET ?? "myaccountactivationsecretkey";
const accountActivationTokenExpires = process.env.JWT_REFRESH_EXPIRES ?? "1h";

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

const sendActivationToken = async (token: string) => {
  console.log("Registration activation token", token);
};

app.post("/api/auth/register", async (req, res) => {
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
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const { id } = await insertUser(transformedEmail, hashedPassword, name);
    const activationToken = jwt.sign({ id }, accountActivationTokenSecret, {
      expiresIn: accountActivationTokenExpires,
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
});

app.post("/api/auth/activate", async (req, res) => {
  try {
    const { activationToken } = req.body;
    let payload;
    try {
      payload = jwt.verify(activationToken, accountActivationTokenSecret) as {
        id?: string;
      };
    } catch (err: any) {
      if (err.message === "jwt malformed") {
        return res.status(400).json({
          status: "Error",
          message: "INVALID_ACTIVATION_TOKEN",
        });
      }
      if (err.message === "jwt expired") {
        return res.status(400).json({
          status: "Error",
          message: "ACTIVATION_TOKEN_EXPIRED",
        });
      }
      throw err;
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
    const refreshToken = jwt.sign({ id: user.id }, jwtRefreshSecret, {
      expiresIn: jtwRefreshExpires,
    });
    RefreshTokens.add(refreshToken, user.id);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: user.id }, jwtAccessSecret, {
          expiresIn: jtwAccessExpires,
        }),
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
      expiresIn: jtwRefreshExpires,
    });
    RefreshTokens.add(refreshToken, userId);
    return res
      .status(200)
      .cookie("refresh", refreshToken, {
        path: "/api/auth",
      })
      .json({
        status: "OK",
        token: jwt.sign({ id: userId }, jwtAccessSecret, {
          expiresIn: jtwAccessExpires,
        }),
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
