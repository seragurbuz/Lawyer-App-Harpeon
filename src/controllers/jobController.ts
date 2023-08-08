import { Request, Response } from 'express';
import { createJob, endJob, getJobById } from '../services/jobServices';
import { CreateJobInput } from '../schemas/jobSchema';

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
export async function endJobHandler(req: Request, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const jobId = Number(req.params.job_id);

  try {
    const success = await endJob(jobId, lawyerId);
    if (success) {
      return res.status(200).json({ message: 'Job ended successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to end job' });
    }
  } catch (error) {
    console.error('Error ending job:', error);
    return res.status(500).json({ error: 'Failed to end job' });
  }
}

// Controller function to get a job by its ID
export async function getJobByIdHandler(req: Request, res: Response) {
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