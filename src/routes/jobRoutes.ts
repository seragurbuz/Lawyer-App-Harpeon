import express from 'express';
import { createJobHandler, endJobHandler, getJobByIdHandler, listCreatedJobsHandler } from '../controllers/jobController';
import requireUser from '../middlewares/requireUser';
import validateResource from '../middlewares/validateResource';
import { createJobSchema, endJobSchema, getJobSchema } from '../schemas/jobSchema';

const jobRouter = express.Router();

/**
   * @openapi
   * '/api/jobs':
   *  post:
   *     tags:
   *     - Job
   *     summary: Create a job
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateJobInput'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateJobResponse'
   *      403:
   *        description: Forbidden
   *      500:
   *        description: Internal server error
   */

// Route for creating a job
jobRouter.post('/api/jobs', validateResource(createJobSchema), requireUser, createJobHandler);

  /**
   * @openapi
   * '/api/jobs/{job_id}/end':
   *  put:
   *     tags:
   *     - Job
   *     summary: End a job by id
   *     parameters:
   *      - name: job_id
   *        in: path
   *        description: The id of the job
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *       400:
   *         description: Bad Request
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal server error
   */

// Route for ending a job
jobRouter.put('/api/jobs/:job_id/end', validateResource(endJobSchema), requireUser, endJobHandler);

  /**
   * @openapi
   * '/api/jobs/{job_id}':
   *  get:
   *     tags:
   *     - Job
   *     summary: Get a job's info by id
   *     parameters:
   *      - name: job_id
   *        in: path
   *        description: The id of the job
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/GetJobResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Job not found
   *       500:
   *         description: Internal server error
   */

// Route for getting a job by its id
jobRouter.get('/api/jobs/:job_id', validateResource(getJobSchema), requireUser, getJobByIdHandler);

/**
 * @openapi
 * '/api/created-jobs':
 *  get:
 *     tags:
 *     - Job
 *     summary: Get the jobs you created
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/GetJobResponse'
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Internal server error
 */

// Route for listing the jobs you created
jobRouter.get("/api/created-jobs", requireUser, listCreatedJobsHandler);

export default jobRouter;
