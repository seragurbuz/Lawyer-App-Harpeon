import express from 'express';
import { getCitiesHandler } from '../controllers/cityController';
import requireUser from '../middlewares/requireUser';

const cityRouter = express.Router();

/**
 * @openapi
 * '/api/cities':
 *  get:
 *     tags:
 *     - City
 *     summary: Get all cities
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  city_id:
 *                   type: integer
 *                   example: 1
 *                  city_name:
 *                    type: string
 *                    example: "Istanbul"
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal server error
 */

cityRouter.get('/api/cities', requireUser, getCitiesHandler);

export default cityRouter;
