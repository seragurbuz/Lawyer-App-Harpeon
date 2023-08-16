import express from "express";
import { getBarsByCityIdHandler } from "../controllers/barController";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { getBarsByCityIdSchema } from "../schemas/barSchema";

const barRouter = express.Router();

  /**
   * @openapi
   * '/api/bars/{city_id}':
   *  get:
   *     tags:
   *     - Bar
   *     summary: Get the bars in a city by city id
   *     parameters:
   *      - name: city_id
   *        in: path
   *        description: The id of the city
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/GetBarsResponse'
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   *       404:
   *         description: No bars found
   *       500:
   *         description: Internal server error
   */

barRouter.get('/api/bars/:city_id', validateResource(getBarsByCityIdSchema), requireUser, getBarsByCityIdHandler);

export default barRouter;