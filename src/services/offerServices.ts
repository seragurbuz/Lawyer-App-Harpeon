import { pool } from "../utils/connectToDb";
import { Job } from "./jobServices";

export interface Offer extends Job{
    offer_id: number;
    from_lawyer_id: number;
    to_lawyer_id: number;
    job_id: number;
    state: 'accepted' | 'waiting' | 'rejected';
  }  

// Function to make an offer
export async function makeOffer(fromLawyerId: number, toLawyerId: number, jobId: number): Promise<boolean> {
    try {
      // Fetch the creator lawyer's ID associated with the job
      const query = `SELECT creator_lawyer_id FROM jobs WHERE job_id = $1;`;
      const result = await pool.query(query, [jobId]);
  
      if (result.rows.length === 0) {
        throw new Error("Job not found.");
      }
  
      const creatorLawyerId = result.rows[0].creator_lawyer_id;
  
      // Check if the lawyer making the offer is the creator lawyer
      if (fromLawyerId !== creatorLawyerId) {
        throw new Error("Only the creator lawyer can make offers for this job.");
      }
  
      // Insert the offer into the offers table
      const insertQuery = `INSERT INTO offers (from_lawyer_id, to_lawyer_id, job_id) VALUES ($1, $2, $3);`;
      await pool.query(insertQuery, [fromLawyerId, toLawyerId, jobId]);
  
      return true;
    } catch (error) {
      console.error("Error making offer:", error);
      return false;
    }
  }  

// Function to reject an offer
export async function rejectOffer(offerId: number, lawyerId: number): Promise<boolean> {
  try {
    // Get the offer details
    const getOfferQuery = `SELECT to_lawyer_id, job_id FROM offers WHERE offer_id = $1;`;
    const offerResult = await pool.query(getOfferQuery, [offerId]);
    
    if (offerResult.rows.length === 0) {
        throw new Error("Offer not found.");
    }
    
    const { to_lawyer_id } = offerResult.rows[0];

    if (to_lawyer_id !== lawyerId) {
        throw new Error("This job is not offered to the current user");
    }

    const updateQuery = `UPDATE offers SET state = 'rejected' WHERE offer_id = $1;`;
    await pool.query(updateQuery, [offerId]);

    return true;
  } catch (error) {
    console.error("Error rejecting offer:", error);
    return false;
  }
}

// Function to accept an offer
export async function acceptOffer(offerId: number, lawyerId: number): Promise<boolean> {
  try {
    // Get the offer details
    const getOfferQuery = `SELECT to_lawyer_id, job_id FROM offers WHERE offer_id = $1;`;
    const offerResult = await pool.query(getOfferQuery, [offerId]);

    if (offerResult.rows.length === 0) {
      throw new Error("Offer not found.");
    }

    const { to_lawyer_id, job_id } = offerResult.rows[0];
    if (to_lawyer_id !== lawyerId) {
        throw new Error("This job is not offered to the current user");
    }


    // Update the offer state to "accepted"
    const updateOfferQuery = `UPDATE offers SET state = 'accepted' WHERE offer_id = $1;`;
    await pool.query(updateOfferQuery, [offerId]);

    // Update the job's lawyer_id with the accepted lawyer
    const updateJobQuery = `UPDATE jobs SET lawyer_id = $1, start_date = NOW(), job_state = 'started' WHERE job_id = $2;`;
    await pool.query(updateJobQuery, [to_lawyer_id, job_id]);

    // Set the associated lawyer's status back to "reserved"
    const updateLawyerStatusQuery = `UPDATE lawyer SET status = 'reserved' WHERE lawyer_id = $1;`;
    await pool.query(updateLawyerStatusQuery, [to_lawyer_id]);

    return true;
  } catch (error) {
    console.error("Error accepting offer:", error);
    return false;
  }
}

// Function to list offers sent by a lawyer
export async function listSentOffers(fromLawyerId: number): Promise<Offer[]> {
    try {
      const query = `
        SELECT 
          offers.offer_id, 
          offers.to_lawyer_id, 
          offers.job_id, 
          offers.state,
          jobs.description,
          jobs.end_date
        FROM offers 
        LEFT JOIN jobs ON offers.job_id = jobs.job_id 
        WHERE from_lawyer_id = $1;`;
      const result = await pool.query(query, [fromLawyerId]);
  
      const sentOffers: Offer[] = result.rows;
      return sentOffers;
    } catch (error) {
      console.error("Error listing sent offers:", error);
      return [];
    }
  }

// Function to list offers received by a lawyer
export async function listReceivedOffers(toLawyerId: number): Promise<Offer[]> {
    try {
      const query = `
        SELECT 
          offers.offer_id, 
          offers.to_lawyer_id, 
          offers.job_id, 
          offers.state,
          jobs.description,
          jobs.end_date
        FROM offers 
        LEFT JOIN jobs ON offers.job_id = jobs.job_id 
        WHERE to_lawyer_id = $1;`;
      const result = await pool.query(query, [toLawyerId]);
  
      const receivedOffers: Offer[] = result.rows;
      return receivedOffers;
    } catch (error) {
      console.error("Error listing received offers:", error);
      return [];
    }
  }
  