import { Request, Response } from 'express';
import {
  createLawyer,
  getLawyerProfileById,
  updateLawyerProfile,
  deleteLawyer,
  getAvailableLawyersByBarId,
  LawyerProfile
} from '../services/lawyerServices';
import {
  CreateLawyerInput,
  UpdateLawyerInput,
} from '../schemas/lawyerSchema';
import { omit } from 'lodash';

// Controller function to create a new lawyer
export async function createLawyerHandler(req: Request<{}, {}, CreateLawyerInput["body"]>, res: Response) {
  try {
    const lawyer = await createLawyer(req);
    if (!lawyer) {
      return res.status(500).json({ error: 'Failed to create lawyer' });
    }

    return res.status(200).json(lawyer);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create lawyer', message: error.message });
  }
}

export async function getLawyerProfileByIdHandler( req: Request, res: Response ) {
  const lawyerId = Number(req.params.lawyer_id);

  if (isNaN(lawyerId)) {
    return res.status(400).send("Invalid lawyer_id");
  }
  try {
    const lawyer = await getLawyerProfileById(lawyerId);

    if (!lawyer) {
      return res.status(404).send("No lawyers found with the specified id");
    }

    return res.status(200).json(lawyer);
  } catch (error) {
    console.error("Error getting lawyer:", error);
    return res.status(500).json({ error: "Failed to get lawyer" });
  }
}

export async function getAvailableLawyersByBarIdHandler(req: Request, res: Response) {
  const barId = Number(req.params.bar_id);

  if (isNaN(barId)) {
    return res.status(400).send("Invalid bar_id");
  }
  try {
    const lawyers = await getAvailableLawyersByBarId(barId);

    if (lawyers.length === 0) {
      return res.status(404).send('No available lawyers found for the specified bar');
    }

    return res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error getting available lawyers by bar ID:', error);
    return res.status(500).send('Failed to get available lawyers');
  }
}

// Controller function to update lawyer profile
export async function updateLawyerProfileHandler(req: Request<{}, {}, UpdateLawyerInput["body"]>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const requestBodyFields = Object.keys(req.body);
  const allowedFields = ["first_name", "last_name", "email", "bar_id", "status", "linkedin_url", "description"];

  // Check for invalid fields in the request body
  for (const field of requestBodyFields) {
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: "You entered a field that cannot be changed" });
    }
  }

  try {
    const updatedLawyerProfile: LawyerProfile | null = await updateLawyerProfile(lawyerId, req);

    if (!updatedLawyerProfile) {
      return res.status(404).json({ error: "Lawyer profile not found" });
    }

    // Omit 'verified' and 'password' fields before sending the response
    const sanitizedProfile = omit(updatedLawyerProfile, ["verified", "password"]) as LawyerProfile;
    return res.status(200).json(sanitizedProfile);
  } catch (error) {
    console.error("Error updating lawyer profile:", error);
    return res.status(500).json({ error: "Failed to update lawyer profile" });
  }
}


// Controller function to delete a lawyer by ID
export async function deleteLawyerHandler(req: Request, res: Response) {
  const lawyerId = Number(req.params.lawyer_id);

  if (isNaN(lawyerId)) {
    return res.status(400).send("Invalid lawyer_id");
  }
  try {
    const deleted = await deleteLawyer(lawyerId);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete lawyer' });
    }

    return res.status(200).json({ message: 'Lawyer deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete lawyer', message: error.message });
  }
}