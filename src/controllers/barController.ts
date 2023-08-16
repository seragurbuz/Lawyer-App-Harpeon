import { Request, Response } from 'express';
import { getBarsByCityId } from '../services/barServices';
import { GetBarsByCityIdInput } from '../schemas/barSchema';

export async function getBarsByCityIdHandler(req: Request<GetBarsByCityIdInput["params"]>, res: Response) {
  const cityId = Number(req.params.city_id);

  if (isNaN(cityId)) {
    // Check if the cityId is a valid number
    return res.status(400).send("Invalid city_id");
  }

  try {
    const bars = await getBarsByCityId(cityId);

    if (!bars) {
      return res.status(404).send('No bars found in the specified city');
    }

    return res.status(200).json(bars);
  } catch (e: any) {
    console.error('Error getting bars by city ID:', e);
    return res.status(500).send('Failed to get bars');
  }
}



