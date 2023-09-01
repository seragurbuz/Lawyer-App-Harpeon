import { getLawyerByEmail, comparePasswords, getLawyerProfileById } from "./lawyerServices";
import config from "config";
import { signJwt, verifyJwt } from "../utils/jwt";
import { pool } from "../utils/connectToDb";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";

// Function to check wheter the email and password matches
export async function validatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const lawyer = await getLawyerByEmail(email);
  
    if (!lawyer) return false;
  
    const isValid = await comparePasswords(lawyer.password, password);
  
    if (!isValid) return false;
  
    // Return the lawyer object without the password field
    const { password: _, ...lawyerWithoutPassword } = lawyer;
    return lawyerWithoutPassword;
  }

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }): Promise<string | null> {
  try {
    // Verify the refresh token and get the decoded data
    const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

    // Check if the refresh token is valid and contains necessary data
    if (!decoded || !decoded.lawyer_id) {
      return null;
    }

    const lawyer = await getLawyerProfileById(decoded.lawyer_id);
    if (!lawyer) {
      return null;
    }

    // Reissue the access token
    const accessToken = signJwt(
      { lawyer_id: lawyer.lawyer_id },
      "accessTokenPrivateKey",
      { expiresIn: config.get("accessTokenTtl") }
    );

    return accessToken;
  } catch (error) {
    console.error('Error reissuing access token:', error);
    return null;
  }
}

// Function to verify lawyer's email
export async function verifyEmail(lawyerId: number): Promise<boolean> {
  try {
    const query = `UPDATE lawyers SET verified = true WHERE lawyer_id = $1;`;
    await pool.query(query, [lawyerId]);
    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
}

// Function to send password reset code
export async function forgotPassword(lawyerId: number): Promise<string | null> {
  try {

    const passwordResetCode = uuidv4();

    const query = `UPDATE lawyers SET password_reset_code = $1 WHERE lawyer_id = $2;`;
    await pool.query(query, [passwordResetCode, lawyerId]);

    return passwordResetCode;
  } catch (error) {
    console.error("Error sending password reset code:", error);
    return null;
  }
}

// Function to reset password
export async function resetPassword(lawyerId: number, password: string): Promise<boolean> {
  try{

    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    await pool.query('UPDATE lawyers SET password = $1, password_reset_code = null WHERE lawyer_id = $2', [hashedPassword, lawyerId]);

    return true;
  }catch (error) {
    console.error("Could not reset lawyer password:", error);
    return false;
  }
}