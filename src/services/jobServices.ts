import { pool } from "../utils/connectToDb";
import { CreateJobInput } from "../schemas/jobSchema";

export interface Job {
    job_id: number;
    description: string;
    end_date: Date;
    job_state: string;
  }

// Function to create a new job
export async function createJob(input: CreateJobInput, creatorLawyerID: number): Promise<Job | null> {
  try {
    const { description, end_date} = input.body;
    const endDate = new Date(end_date);

    const query = `INSERT INTO jobs (description, end_date, creator_lawyer_id) VALUES ($1, $2, $3) RETURNING *;`;
    const values = [description, endDate, creatorLawyerID];
    const result = await pool.query(query, values);

    return result.rows[0] as Job;
  } catch (error) {
    console.error("Error creating job:", error);
    return null;
  }
}

// Function to end a job
export async function endJob(jobId: number, lawyerId: number): Promise<boolean> {
  try {
    // Get the job details
    const getJobQuery = `SELECT lawyer_id FROM jobs WHERE job_id = $1;`;
    const jobResult = await pool.query(getJobQuery, [jobId]);

    if (jobResult.rows.length === 0) {
      throw new Error("Job not found.");
    }

    const lawyer_id = jobResult.rows[0].lawyer_id;

    // Check if the lawyer trying to end the job is the creator
    if (lawyer_id !== lawyerId) {
      throw new Error("You don't have the permission to end this job.");
    }

    // Update the job's end_date to mark it as ended
    const updateJobQuery = `UPDATE jobs SET end_date = NOW(), job_state = 'ended' WHERE job_id = $1;`;
    await pool.query(updateJobQuery, [jobId]);

    // Set the associated lawyer's status back to "available"
    const updateLawyerStatusQuery = `UPDATE lawyer SET status = 'available' WHERE lawyer_id = (SELECT lawyer_id FROM jobs WHERE job_id = $1);`;
    await pool.query(updateLawyerStatusQuery, [jobId]);

    return true;
  } catch (error) {
    console.error("Error ending job:", error);
    return false;
  }
}

// Function to get a job by its ID
export async function getJobById(jobId: number) {
  try {
    const query = `SELECT * FROM jobs WHERE job_id = $1;`;
    
    const result = await pool.query(query, [jobId]);

    if (result.rows.length === 0) {
      return null; // Job not found
    }

    return result.rows[0]; // Return the job details
  } catch (error) {
    console.error("Error getting job by ID:", error);
    return null;
  }
}

// Function to list jobs created by a lawyer
export async function listCreatedJobs(lawyerId: number): Promise<Job[]> {
  try {
    const query = `SELECT * FROM jobs WHERE creator_lawyer_id = $1;`;
    const result = await pool.query(query, [lawyerId]);

    const createdJobs: Job[] = result.rows;
    return createdJobs;
  } catch (error) {
    console.error("Error listing created jobs:", error);
    return [];
  }
}
