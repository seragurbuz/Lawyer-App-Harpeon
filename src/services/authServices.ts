import { getLawyerByEmail, comparePasswords, getLawyerProfileById } from "./lawyerServices";
import config from "config";
import { signJwt, verifyJwt } from "../utils/jwt";

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
