import { pool } from '../utils/connectToDb';

export interface Bar {
  bar_id: number;
  bar_name: string;
  city_id: number;
}

export async function getBarsByCityId(city_id: number): Promise<Bar[]> {
  try {
    const query = 'SELECT * FROM bar WHERE city_id = $1;';
    const values = [city_id];
    const result = await pool.query(query, values);

    return result.rows as Bar[];
  } catch (error) {
    console.error('Error getting bars by city ID:', error);
    return [];
  }
}
