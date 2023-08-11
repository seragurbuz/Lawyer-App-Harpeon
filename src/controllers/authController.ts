import { Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import {LoginInput, VerifyEmailInput, ForgotPasswordInput, ResetPasswordInput} from "../schemas/authSchema";
import { forgotPassword, resetPassword, validatePassword, verifyEmail } from "../services/authServices";
import config from "config";
import { getLawyerByEmail, getLawyerProfileById } from "../services/lawyerServices";
import log from "../utils/logger"
import sendEmail from "../utils/mailer";


export async function loginHandler(req: Request<{}, {}, LoginInput["body"]>, res: Response) {
  try {

  // Validate the email and password
  const lawyer = await validatePassword(req.body);
  const message = "Invalid email or password";

  if (!lawyer) {
    return res.status(401).send(message);
  }

  // create an access token
  const accessToken = signJwt({ lawyer_id: lawyer.lawyer_id }, "accessTokenPrivateKey", {
    expiresIn: config.get("accessTokenTtl")
  });

  // create a refresh token
  const refreshToken = signJwt({ lawyer_id: lawyer.lawyer_id }, "refreshTokenPrivateKey",{ 
      expiresIn: config.get("refreshTokenTtl") 
  });

  // return access & refresh tokens
  return res.status(200).json({ message: "Login successful", accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
}

export async function verifyEmailHandler( req: Request<{}, {}, VerifyEmailInput["body"]>, res: Response ) {
  const lawyer_id = req.body.lawyer_id;
  const verification_code = req.body.verification_code;

  // find the user by id
  const lawyer = await getLawyerProfileById(lawyer_id);

  if (!lawyer) {
    return res.send("Could not verify lawyer");
  }

  // check to see if they are already verified
  if (lawyer.verified) {
    return res.send("Lawyer is already verified");
  }

  // check to see if the verificationCode matches
  if (lawyer.verification_code === verification_code) {
    await verifyEmail(lawyer_id);

    return res.send("Lawyer successfully verified");
  }
  return res.send("Could not verify lawyer");
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput["body"]>, res: Response) {

  const message = "If a lawyer with that email is registered you will receive a password reset email";

  const { email } = req.body;

  const lawyer = await getLawyerByEmail(email);

  if (!lawyer) {
    log.debug(`Lawyer with email ${email} does not exists`);
    return res.send(message);
  }

  if (!lawyer.verified) {
    return res.send("Lawyer is not verified");
  }

  const passwordResetCode = await forgotPassword(lawyer.lawyer_id);

  await sendEmail({
    to: lawyer.email,
    from: "test@example.com",
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode}. Id ${lawyer.lawyer_id}`,
  });

  log.debug(`Password reset email sent to ${email}`);

  return res.send(message);
}

export async function resetPasswordHandler( req: Request<{}, {}, ResetPasswordInput["body"]>, res: Response ) {

  const { lawyer_id, password_reset_code, password } = req.body;

  const lawyer = await getLawyerProfileById(lawyer_id);

  if ( !lawyer || !lawyer.password_reset_code || lawyer.password_reset_code !== password_reset_code) {
    return res.status(400).send("Could not reset lawyer password");
  }

  await resetPassword(lawyer_id, password);

  return res.send("Successfully updated password");
}
