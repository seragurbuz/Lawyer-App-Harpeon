import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../services/authServices";
import { verifyJwt } from "../utils/jwt";


const requireOwnProfile = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/,"");
  const refreshToken = get(req, "headers.x-refresh") as string;

  if (!accessToken) {
    return res.sendStatus(401);
  }

  try {
    // Use the correct public key for verification (accessTokenPublicKey)
    const verificationResult = verifyJwt(accessToken, "accessTokenPublicKey");

    if (!verificationResult.valid || !verificationResult.decoded) {
      return res.sendStatus(401);
    }

    // Get the lawyer ID from the payload of the verified access token
    const lawyerId = verificationResult.decoded.lawyer_id.toString();

    // Get the profile ID from the request params or body, depending on your API design
    const profileId = req.params.lawyer_id; 

    // Check if the lawyer ID from the access token matches the profile being visited/updated
    if (lawyerId !== profileId) {
        return res.status(403).send("Access denied. You can only update your own profile.");
    }

    return next();
  } catch (err: any) {
    console.log(err);
    if (err.name === "TokenExpiredError" && refreshToken) {
      // If the access token has expired and a refresh token is available, reissue a new access token
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken) {
        // Set the new access token in the response header
        res.setHeader("x-access-token", newAccessToken);

        const newVerificationResult = verifyJwt(accessToken, "accessTokenPublicKey");

        if (!newVerificationResult.valid || !newVerificationResult.decoded) {
          return res.sendStatus(401);
        }

        // Get the lawyer ID from the new access token payload
        const lawyerId = newVerificationResult.decoded.lawyer_id.toString();

        // Get the profile ID from the request params or body, depending on your API design
        const profileId = req.params.lawyer_id; 

        // Check if the lawyer ID from the new access token matches the profile being visited/updated
        if (lawyerId !== profileId) {
            return res.status(403).send("Access denied. You can only update your own profile.");
        }

        return next();
      }
    }

    return res.sendStatus(401) }
};

export default requireOwnProfile;
