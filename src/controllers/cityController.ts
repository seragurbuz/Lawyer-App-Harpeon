import { Request, Response } from "express";
import { getCities } from "../services/cityServices";

export async function getCitiesHandler(req: Request, res: Response) {
  try {
    const cities = await getCities();
    return res.status(200).json(cities);
  } catch (e: any) {
    return res.status(500).json({ error: 'Failed to get cities', message: e.message });
  }
}
