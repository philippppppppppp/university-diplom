import { Router } from "express";
import { registerHandler } from "./register";
import { activationHandler } from "./activate";
import { loginHandler } from "./login";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/activate", activationHandler);
authRouter.post("/login", loginHandler);

export { authRouter };
