import { Router } from "express";
import { giveStarRatingHandler } from "../controllers/starController";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { ratingSchema } from "../schemas/starSchema";

const starRouter = Router();

  /**
   * @openapi
   * '/api/ratings/{lawyer_id}':
   *  post:
   *     tags:
   *     - Rating
   *     summary: Rate another lawyer
   *     parameters:
   *      - name: lawyer_id
   *        in: path
   *        description: The id of the lawyer to be rated
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/RatingInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/RatingResponse'
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Target lawyer not found
   *       500:
   *         description: Internal server error
   */

starRouter.post("/api/ratings/:lawyer_id", requireUser, validateResource(ratingSchema), giveStarRatingHandler);

export default starRouter;
