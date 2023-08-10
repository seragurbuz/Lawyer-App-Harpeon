import { pool } from '../utils/connectToDb';
import { CreateLawyerInput, UpdateLawyerInput} from '../schemas/lawyerSchema';
import argon2 from "argon2";
import { omit } from 'lodash';

export interface Lawyer {
  lawyer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bar_id: number;
  status: string;
  verified: boolean;
}

export interface LawyerProfile extends Lawyer {
  linkedin_url: string;
  description: string;
  star_rating: number;
}

// Function to hash the password using argon2
async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

// Function to compare the provided password with the hashed password
export async function comparePasswords(hashedPassword: string, candidatePassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, candidatePassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

// Function to create a new lawyer
export async function createLawyer(input: CreateLawyerInput): Promise<Lawyer | null> {
  try {
    // Destructure the nested 'body' object to get individual properties
    const { first_name, last_name, email, password, passwordConfirmation, bar_id } = input.body;

    // Check if the password and password confirmation match
    if (password !== passwordConfirmation) {
      throw new Error("Passwords do not match");
    }

    // Hash the password using argon2
    const hashedPassword = await hashPassword(password);

    // Start a transaction to ensure data consistency
    await pool.query("BEGIN");

    const insertLawyerQuery = `
      INSERT INTO lawyer (first_name, last_name, email, password, bar_id, status, verified)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *;
    `;

    const lawyerValues = [first_name, last_name, email, hashedPassword, bar_id, 'available'];

    const result = await pool.query(insertLawyerQuery, lawyerValues);

    // Get the inserted lawyer's info
    const createdLawyer = omit(result.rows[0], "password") as Lawyer;

    const lawyer_id = result.rows[0].lawyer_id;

    // Insert the lawyer_id into the lawyer_profile table
    const insertProfileQuery = `
      INSERT INTO lawyer_profile (lawyer_id, linkedin_url, description, star_rating)
      VALUES ($1, $2, $3, $4);
    `;

    const profileValues = [lawyer_id, null, null, 0];

    await pool.query(insertProfileQuery, profileValues);

    // Commit the transaction if everything is successful
    await pool.query("COMMIT");

    return createdLawyer;
  } catch (error) {
    // Rollback the transaction if there is an error
    await pool.query("ROLLBACK");
    console.error('Error creating lawyer:', error);
    return null;
  }
}


// Function to get a lawyer's profile by ID
export async function getLawyerProfileById(id: number): Promise<LawyerProfile | null> {
  try {
    const query = `
      SELECT 
        lawyer.lawyer_id, 
        lawyer.first_name, 
        lawyer.last_name, 
        lawyer.email, 
        lawyer.bar_id, 
        lawyer.status, 
        lawyer.verified,
        lawyer_profile.linkedin_url,
        lawyer_profile.description,
        lawyer_profile.star_rating
      FROM lawyer
      LEFT JOIN lawyer_profile ON lawyer.lawyer_id = lawyer_profile.lawyer_id
      WHERE lawyer.lawyer_id = $1;
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const lawyerProfile = omit(result.rows[0], "password") as LawyerProfile;

    return lawyerProfile;
  } catch (error) {
    console.error("Error getting lawyer by ID:", error);
    return null;
  }
}

// Function to get available lawyers in a bar
export async function getAvailableLawyersByBarId(bar_id: number, searchingLawyerId: number): Promise<LawyerProfile[]> {
  try {
    const query = `
      SELECT 
        lawyer.lawyer_id, 
        lawyer.first_name, 
        lawyer.last_name, 
        lawyer.email, 
        lawyer.bar_id, 
        lawyer.status,
        lawyer.verified,
        lawyer_profile.linkedin_url,
        lawyer_profile.description,
        lawyer_profile.star_rating
      FROM lawyer
      LEFT JOIN lawyer_profile ON lawyer.lawyer_id = lawyer_profile.lawyer_id
      WHERE lawyer.bar_id = $1 AND lawyer.status = $2 AND lawyer.lawyer_id != $3;
    `;
    const values = [bar_id, 'available', searchingLawyerId];
    const result = await pool.query(query, values);

    // Omit 'verified' and 'password' fields from each lawyer profile in the result
    const lawyerProfiles: LawyerProfile[] = result.rows.map((row) => omit(row, "password") as LawyerProfile);

    return lawyerProfiles;
  } catch (error) {
    console.error('Error getting available lawyers by bar ID:', error);
    return [];
  }
}

// Function to update a lawyer profile
export async function updateLawyerProfile(lawyerId: number, updatedProfile: UpdateLawyerInput): Promise<LawyerProfile | null> {
  try {
    // Destructure the fields from the updatedProfile
    const { first_name, last_name, email, bar_id, status, linkedin_url, description} = updatedProfile.body;

    if (first_name !== undefined) {
      await pool.query('UPDATE lawyer SET first_name = $1 WHERE lawyer_id = $2', [first_name, lawyerId]);
    }
    if (last_name !== undefined) {
      await pool.query('UPDATE lawyer SET last_name = $1 WHERE lawyer_id = $2', [last_name, lawyerId]);
    }
    if (email !== undefined) {
      await pool.query('UPDATE lawyer SET email = $1 WHERE lawyer_id = $2', [email, lawyerId]);
    }

    if (bar_id !== undefined) {
      await pool.query('UPDATE lawyer SET bar_id = $1 WHERE lawyer_id = $2', [bar_id, lawyerId]);

    }
    if (status !== undefined) {
      await pool.query('UPDATE lawyer SET status = $1 WHERE lawyer_id = $2', [status, lawyerId]);
    }

    if (linkedin_url !== undefined) {
      await pool.query('UPDATE lawyer_profile SET linkedin_url = $1 WHERE lawyer_id = $2', [linkedin_url, lawyerId]);
    }

    if (description !== undefined) {
      await pool.query('UPDATE lawyer_profile SET description = $1 WHERE lawyer_id = $2', [description, lawyerId]);
    }

    const updatedLawyerProfile = await getLawyerProfileById(lawyerId);

    return updatedLawyerProfile;
  } catch (error) {
    console.error("Error updating lawyer profile:", error);
    return null;
  }
}

// Function to get a lawyer by email
export async function getLawyerByEmail(email: string): Promise<Lawyer | null> {
  try {
    const query = 'SELECT * FROM lawyer WHERE email = $1;';
    const values = [email];
    const result = await pool.query(query, values);

    // Check if a lawyer with the given email exists
    if (result.rows.length === 0) {
      return null;
    }

    // Return the lawyer object
    return result.rows[0] as Lawyer;
  } catch (error) {
    console.error('Error getting lawyer by email:', error);
    return null;
  }
}
