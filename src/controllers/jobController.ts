import { Request, Response } from 'express';
import { createJob, endJob, getJobById, listCreatedJobs } from '../services/jobServices';
import { CreateJobInput, EndJobInput, GetJobInput } from '../schemas/jobSchema';

// Controller func to create a job
export async function createJobHandler(req: Request<any, any, CreateJobInput["body"]>, res: Response) {

    const creator_lawyer_id = res.locals.user.lawyer_id;

    try {
      const job = await createJob(req, creator_lawyer_id );
    if (job !== null) {
      return res.status(201).json(job);
    } else {
      return res.status(500).json({ error: 'Failed to create job' });
    }
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

// Controller func to end a job
export async function endJobHandler(req: Request<EndJobInput["params"]>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const jobId = Number(req.params.job_id);

  try {
    const result = await endJob(jobId, lawyerId);
    if (result === true) {
      return res.status(200).json({ message: 'Job ended successfully' });
    } 
    if (typeof result === 'string') {
      return res.status(400).json({ error: result });
    }
  } catch (error) {
    console.error('Error ending job:', error);
    return res.status(500).json({ error: 'Failed to end job' });
  }
}

// Controller function to get a job by its ID
export async function getJobByIdHandler(req: Request<GetJobInput["params"]>, res: Response) {
  const jobId = Number(req.params.job_id);

  try {
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error in getJobByIdHandler:", error);
    return res.status(500).json({ error: "Failed to get job by ID" });
  }
}

export async function listCreatedJobsHandler(req: Request, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;

  try {
    const createdJobs = await listCreatedJobs(lawyerId);
    return res.status(200).json(createdJobs);
  } catch (error) {
    console.error("Error listing created jobs:", error);
    return res.status(500).json({ error: "Failed to list created jobs" });
  }
}
