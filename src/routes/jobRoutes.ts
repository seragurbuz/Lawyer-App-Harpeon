import express from 'express';
import { createJobHandler, endJobHandler, getJobByIdHandler, listCreatedJobsHandler } from '../controllers/jobController';
import requireUser from '../middlewares/requireUser';
import validateResource from '../middlewares/validateResource';
import { createJobSchema } from '../schemas/jobSchema';

const jobRouter = express.Router();

// Route for creating a job
jobRouter.post('/api/jobs', validateResource(createJobSchema), requireUser, createJobHandler);
// Route for ending a job
jobRouter.put('/api/jobs/:job_id/end', requireUser, endJobHandler);
// Route for getting a job by its id
jobRouter.get('/api/jobs/:job_id', requireUser, getJobByIdHandler);
// Route for listing the jobs you created
jobRouter.get("/api/created-jobs", requireUser, listCreatedJobsHandler);

export default jobRouter;
