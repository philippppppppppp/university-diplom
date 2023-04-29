import { Router } from "express";
import { registerHandler } from "./register";
import { activationHandler } from "./activate";
import { loginHandler } from "./login";
import { refreshHandler } from "./refresh";
import { logoutHandler } from "./logout";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/activate", activationHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);

export { authRouter };
