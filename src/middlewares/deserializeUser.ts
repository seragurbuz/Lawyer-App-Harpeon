import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { reIssueAccessToken } from "../services/authServices";
import { getLawyerProfileById } from "../services/lawyerServices";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/,"");

  const refreshToken = get(req, "headers.x-refresh") as string;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    const lawyer = await getLawyerProfileById(decoded.lawyer_id);
    if(!lawyer?.verified){
      return res.status(401).json({ error: "Email not verified. Please verify your email" })
    }
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({refreshToken});

    if (newAccessToken) {
      return res.status(200).json({ message: "Previous access token has expired, changed with the new one", newAccessToken: newAccessToken });
    }

    const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;