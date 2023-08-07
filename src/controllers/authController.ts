import { Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import {LoginInput} from "../schemas/authSchema";
import { validatePassword } from "../services/authServices";
import config from "config";

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
