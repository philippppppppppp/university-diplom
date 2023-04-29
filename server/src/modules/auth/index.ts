import { Router } from "express";
import { registerHandler } from "./register";
import { activationHandler } from "./activate";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/activate", activationHandler);

export { authRouter };
