import { pool } from '../utils/connectToDb';

export interface City {
  city_id: number;
  city_name: string;
}

export async function getCities(): Promise<City[]> {
  try {
    const query = 'SELECT * FROM city;';
    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    console.error('Error getting cities:', error);
    return [];
  }
}

