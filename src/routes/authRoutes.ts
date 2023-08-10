import express from "express";
import {loginHandler, verifyEmailHandler, forgotPasswordHandler, resetPasswordHandler} from "../controllers/authController";
import validateResource from "../middlewares/validateResource";
import { loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/authSchema";

const authRouter = express.Router();

// Route for login
authRouter.post("/api/login", validateResource(loginSchema), loginHandler);
// Route for verifying lawyer email
authRouter.post('/api/verify-email', validateResource(verifyEmailSchema), verifyEmailHandler);
// Route for sending password reset code
authRouter.post("/api/forgot-password", validateResource(forgotPasswordSchema), forgotPasswordHandler );
// Route for reseting password
authRouter.post("/api/reset-password", validateResource(resetPasswordSchema), resetPasswordHandler );

export default authRouter;