import express from "express";
import validateResource from "../middlewares/validateResource";
import { createLawyerHandler, getLawyerProfileByIdHandler, updateLawyerProfileHandler, getAvailableLawyersHandler, getLawyerLocationHandler, updateLawyerLocationHandler } from "../controllers/lawyerController";
import { createLawyerSchema, getLawyerProfileSchema, updateLawyerLocationSchema, updateLawyerSchema } from "../schemas/lawyerSchema";
import requireUser from "../middlewares/requireUser";

const lawyerRouter = express.Router();

/**
   * @openapi
   * '/api/register':
   *  post:
   *     tags:
   *     - Lawyer
   *     summary: Register a lawyer
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateLawyerInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateLawyerResponse'
   *      500:
   *        description: Internal server error
   */

// Route for creating a new lawyer
lawyerRouter.post('/api/register', validateResource(createLawyerSchema), createLawyerHandler);

  /**
   * @openapi
   * '/api/lawyers/profile/{lawyer_id}':
   *  get:
   *     tags:
   *     - Lawyer
   *     summary: Get the profile of a lawyer by id
   *     parameters:
   *      - name: lawyer_id
   *        in: path
   *        description: The id of the lawyer
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/GetLawyerProfileResponse'
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Lawyer not found
   *       500:
   *         description: Internal server error
   */

// Route for getting a lawyer profile by ID
lawyerRouter.get('/api/lawyers/profile/:lawyer_id',validateResource(getLawyerProfileSchema), requireUser, getLawyerProfileByIdHandler);

  /**
   * @openapi
   * '/api/available-lawyers':
   *  get:
   *     tags:
   *     - Lawyer
   *     summary: Get available lawyers with filters and sorting
   *     parameters:
   *      - name: city
   *        in: query
   *        description: Filter by city id
   *        require: false
   *      - name: bar
   *        in: query
   *        description: Filter by bar id
   *        required: false
   *      - name: minRating
   *        in: query
   *        description: Filter by minimum star rating
   *        required: false
   *      - name: maxRating
   *        in: query
   *        description: Filter by maximum star rating
   *        required: false
   *      - name: sort
   *        schema:
   *          type: string
   *          enum: [asc, desc]
   *        in: query
   *        description: Sort by star rating
   *        required: false
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *             type: array
   *             items:
   *               $ref: '#/components/schemas/GetLawyerProfileResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: No available lawyers found
   *       500:
   *         description: Internal server error
   */

// Route for listing available lawyers according to the filters and sorts
// Ex: '/api/available-lawyers?city=1&bar=2&minRating=3&maxRating=5&sort=desc'
lawyerRouter.get('/api/available-lawyers', requireUser, getAvailableLawyersHandler);

/**
   * @openapi
   * '/api/myprofile/update':
   *  put:
   *     tags:
   *     - Lawyer
   *     summary: Update your lawyer profile
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/UpdateLawyerInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetLawyerProfileResponse'
   *      400:
   *        description: Bad request
   *      403:
   *        description: Forbidden
   *      404:
   *        description: Lawyer not found
   *      500:
   *        description: Internal server error
   */

// Route for updating lawyer profile
lawyerRouter.put('/api/myprofile/update', validateResource(updateLawyerSchema), requireUser, updateLawyerProfileHandler);

  /**
   * @openapi
   * '/api/location':
   *  get:
   *     tags:
   *     - Lawyer
   *     summary: Get the location of the lawyer
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/GetLawyerLocationResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Location not found
   *       500:
   *         description: Internal server error
   */


// Route for getting lawyer location
lawyerRouter.get('/api/location', requireUser, getLawyerLocationHandler);

  /**
   * @openapi
   * '/api/location/update':
   *  put:
   *     tags:
   *     - Lawyer
   *     summary: Update the location of the lawyer
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/UpdateLawyerLocationInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/UpdateLawyerLocationResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Bar not found
   *       500:
   *         description: Internal server error
   */

// Route for updating lawyer location
lawyerRouter.put('/api/location/update', validateResource(updateLawyerLocationSchema), requireUser, updateLawyerLocationHandler);

export default lawyerRouter;
