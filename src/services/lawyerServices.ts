import { pool } from '../utils/connectToDb';
import { CreateLawyerInput, UpdateLawyerInput} from '../schemas/lawyerSchema';
import argon2 from "argon2";
import { omit } from 'lodash';
import { v4 as uuidv4 } from "uuid";

export interface Lawyer {
  lawyer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bar_id: number;
  status: string;
  verified: boolean;
  verification_code: string;
  password_reset_code: string;
}

export interface LawyerProfile extends Lawyer {
  linkedin_url: string;
  description: string;
  star_rating: number;
}

export interface GetAvailableLawyersFilters {
  city?: number;
  bar?: number;
  minRating?: number;
  maxRating?: number;
  sort?: 'asc' | 'desc';
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

    // Generate a default verification code
    const verificationCode = uuidv4();

    // Check if the password and password confirmation match
    if (password !== passwordConfirmation) {
      throw new Error("Passwords do not match");
    }

    // Hash the password using argon2
    const hashedPassword = await hashPassword(password);

    // Start a transaction to ensure data consistency
    await pool.query("BEGIN");

    const insertLawyerQuery = `
      INSERT INTO lawyer (first_name, last_name, email, password, bar_id, status, verification_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const lawyerValues = [first_name, last_name, email, hashedPassword, bar_id, 'available', verificationCode];

    const result = await pool.query(insertLawyerQuery, lawyerValues);

    // Get the inserted lawyer's info
    const createdLawyer = result.rows[0] as Lawyer;

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
        lawyer.verification_code,
        lawyer.password_reset_code,
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

    const lawyerProfile = result.rows[0] as LawyerProfile;

    return lawyerProfile;
  } catch (error) {
    console.error("Error getting lawyer by ID:", error);
    return null;
  }
}

// Function to get available lawyers in a bar
export async function getAvailableLawyers(searchingLawyerId: number, filters: GetAvailableLawyersFilters): Promise<LawyerProfile[]> {
  try {
    let query = `
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
      WHERE lawyer.status = $1 AND lawyer.lawyer_id != $2
    `;

    const values = ['available', searchingLawyerId];

    // filtering
    if (filters.city !== undefined) {
      query += ` AND lawyer.bar_id IN (SELECT bar_id FROM bar WHERE city_id = $${values.length + 1})`;
      values.push(filters.city);
    }

    if (filters.bar !== undefined) {
      query += ` AND lawyer.bar_id = $${values.length + 1}`;
      values.push(filters.bar);
    }

    if (filters.minRating !== undefined) {
      query += ` AND lawyer_profile.star_rating >= $${values.length + 1}`;
      values.push(filters.minRating);
    }

    if (filters.maxRating !== undefined) {
      query += ` AND lawyer_profile.star_rating <= $${values.length + 1}`;
      values.push(filters.maxRating);
    }

    // sorting
    if (filters.sort === 'desc') {
      query += ` ORDER BY lawyer_profile.star_rating DESC`;
    } else if (filters.sort === 'asc') {
      query += ` ORDER BY lawyer_profile.star_rating ASC`;
    }

    const result = await pool.query(query, values);

    const lawyerProfiles: LawyerProfile[] = result.rows.map((row) => omit(row, ["password", "verification_code", "password_reset_code"]) as LawyerProfile);

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

// Function to get lawyer's location information
export async function getLawyerLocation(lawyerId: number) {
  try {
    const query = `
      SELECT c.city_id, c.city_name, b.bar_id, b.bar_name
      FROM lawyer l
      INNER JOIN bar b ON l.bar_id = b.bar_id
      INNER JOIN city c ON b.city_id = c.city_id
      WHERE l.lawyer_id = $1;
    `;

    const result = await pool.query(query, [lawyerId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error getting lawyer's location:", error);
    return null;
  }
}

// Function to update lawyer location
export async function updateLawyerLocation(lawyerId: number, barName: string): Promise<boolean> {
  try {
    // Check if the bar exists
    const checkBarQuery = `SELECT bar_id FROM bar WHERE bar_name = $1;`;
    const barResult = await pool.query(checkBarQuery, [barName]);

    if (barResult.rows.length === 0) {
      throw new Error("Bar not found.");
    }

    const barId = barResult.rows[0].bar_id;

    // Update the lawyer's bar_id
    const updateLawyerQuery = `UPDATE lawyer SET bar_id = $1 WHERE lawyer_id = $2;`;
    await pool.query(updateLawyerQuery, [barId, lawyerId]);

    return true;
  } catch (error) {
    console.error("Error updating lawyer location:", error);
    return false;
  }
}
