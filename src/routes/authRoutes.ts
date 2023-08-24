import express from "express";
import {loginHandler, verifyEmailHandler, forgotPasswordHandler, resetPasswordHandler} from "../controllers/authController";
import validateResource from "../middlewares/validateResource";
import { loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/authSchema";

const authRouter = express.Router();

/**
 * @openapi
 * '/api/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      401:
 *        description: Invalid credentials
 *      500:
 *        description: Internal server error
 */

// Route for login
authRouter.post("/api/login", validateResource(loginSchema), loginHandler);

/**
 * @openapi
 * '/api/verify-email':
 *  post:
 *     tags: 
 *     - Auth
 *     summary: Verify lawyer's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VerificationResponse'
 *      400:
 *        description: Bad request
 *      404:
 *        description: Lawyer not found
 *      409:
 *        description: Lawyer is already verified
 *      500:
 *        description: Internal server error
 */

// Route for verifying lawyer email
authRouter.post('/api/verify-email', validateResource(verifyEmailSchema), verifyEmailHandler);

/**
 * @openapi
 * '/api/forgot-password':
 *  post:
 *     tags: 
 *     - Auth
 *     summary: Send password reset code to lawyer's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForgotPasswordResponse'
 *      409:
 *        description: Lawyer is not verified
 *      500:
 *        description: Internal server error
 */

// Route for sending password reset code
authRouter.post("/api/forgot-password", validateResource(forgotPasswordSchema), forgotPasswordHandler );

/**
 * @openapi
 * '/api/reset-password':
 *  post:
 *     tags: 
 *     - Auth
 *     summary: Reset lawyer's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResetPasswordResponse'
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal server error
 */

// Route for reseting password
authRouter.post("/api/reset-password", validateResource(resetPasswordSchema), resetPasswordHandler );

export default authRouter;