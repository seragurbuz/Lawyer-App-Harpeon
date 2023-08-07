import { Router } from "express";
import { giveStarRatingHandler } from "../controllers/starController";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { ratingSchema } from "../schemas/starSchema";

const starRouter = Router();

starRouter.post("/api/ratings/:lawyer_id", requireUser, validateResource(ratingSchema), giveStarRatingHandler);

export default starRouter;
