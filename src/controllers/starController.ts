import { Request, Response } from "express";
import { ratingInput } from "../schemas/starSchema";
import { giveStarRating } from "../services/starServices";

export async function giveStarRatingHandler(req: Request<any, any, ratingInput["body"]>, res: Response) {
  const fromLawyerId = res.locals.user.lawyer_id;
  const toLawyerId = Number(req.params.lawyer_id);

  // Check if the fromLawyerId and toLawyerId are the same
  if (fromLawyerId === toLawyerId) {
    return res.status(400).json({ error: "You cannot give a star rating to yourself" });
  }

  try {
    const result = await giveStarRating(fromLawyerId, toLawyerId, req.body.rating);
    if (typeof result === 'string') {
      return res.status(404).json({ error: result });
    }

    return res.status(200).json({ message: "Star rating given successfully" });
  } catch (error) {
    console.error("Error giving star rating:", error);
    return res.status(500).json({ error: "Failed to give star rating" });
  }
}
