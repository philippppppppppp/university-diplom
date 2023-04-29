import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./auth";

const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.use("/auth", authRouter);

export { router };
