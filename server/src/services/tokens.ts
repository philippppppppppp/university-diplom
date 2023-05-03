import jwt from "jsonwebtoken";
import { config } from "../config";

interface Payload {
  id?: string;
}

export const getAccessToken = (id: string) =>
  jwt.sign({ id, "x-hasura-role": "user" }, config.jwtAccessSecret, {
    expiresIn: config.jtwAccessExpires,
  });

export const getRefreshToken = (id: string) =>
  jwt.sign({ id }, config.jwtRefreshSecret, {
    expiresIn: config.jtwRefreshExpires,
  });

export const getActivationToken = (id: string) =>
  jwt.sign({ id }, config.accountActivationSecret, {
    expiresIn: config.accountActivationExpires,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwtAccessSecret) as Payload;

export const verifyActivationToken = (token: string) =>
  jwt.verify(token, config.accountActivationSecret) as Payload;

export const decodeToken = (token: string) => jwt.decode(token) as Payload;
