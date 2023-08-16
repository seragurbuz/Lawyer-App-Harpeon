import { Request, Response } from 'express';
import { createLawyer, getLawyerProfileById, updateLawyerProfile, getAvailableLawyers, LawyerProfile, getLawyerLocation, updateLawyerLocation} from '../services/lawyerServices';
import { CreateLawyerInput, GetLawyerProfileInput, UpdateLawyerInput, UpdateLawyerLocationInput } from '../schemas/lawyerSchema';
import { omit } from 'lodash';
import sendEmail from '../utils/mailer';

export interface GetAvailableLawyersQuery {
  city?: string;
  bar?: string;
  minRating?: string;
  maxRating?: string;
  sort?: 'asc' | 'desc';
}

// Controller function to create a new lawyer
export async function createLawyerHandler(req: Request<{}, {}, CreateLawyerInput["body"]>, res: Response) {
  try {

    const lawyer = await createLawyer(req);

    if (!lawyer) {
      return res.status(500).json({ error: 'Failed to create lawyer' });
    }

    // sending the verification code
    await sendEmail({
      to: lawyer.email,
      from: "test@example.com",
      subject: "Verify your email",
      text: `verification code: ${lawyer.verification_code}. Id: ${lawyer.lawyer_id}`,
    });

    return res.status(200).json(omit(lawyer, ["password", "verification_code", "password_reset_code"]));
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create lawyer', message: error.message });
  }
}

// Controller func to get a lawyer's profile by id
export async function getLawyerProfileByIdHandler( req: Request<GetLawyerProfileInput["params"]>, res: Response ) {
  const lawyerId = Number(req.params.lawyer_id);

  if (isNaN(lawyerId)) {
    return res.status(400).send("Invalid lawyer_id");
  }
  try {
    const lawyer = await getLawyerProfileById(lawyerId);

    if (!lawyer) {
      return res.status(404).send("No lawyers found with the specified id");
    }

    return res.status(200).json(omit(lawyer, ["password", "verification_code", "password_reset_code"]));
  } catch (error) {
    console.error("Error getting lawyer:", error);
    return res.status(500).json({ error: "Failed to get lawyer" });
  }
}

// Controller function to get available lawyers
export async function getAvailableLawyersHandler(req: Request<{}, {}, {}, GetAvailableLawyersQuery>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  
  const { city, bar, minRating, maxRating, sort } = req.query;

  try {
    const lawyers = await getAvailableLawyers(lawyerId, {
      city: city ? Number(city) : undefined,
      bar: bar ? Number(bar) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      maxRating: maxRating ? parseFloat(maxRating) : undefined,
      sort,
    });

    if (lawyers.length === 0) {
      return res.status(404).send('No available lawyers found for the specified criteria');
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
    const sanitizedProfile = omit(updatedLawyerProfile,  ["password", "verification_code", "password_reset_code"]) as LawyerProfile;
    return res.status(200).json(sanitizedProfile);
  } catch (error) {
    console.error("Error updating lawyer profile:", error);
    return res.status(500).json({ error: "Failed to update lawyer profile" });
  }
}

// Controller function to get lawyer's location
export async function getLawyerLocationHandler(req: Request, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;

  try {
    const lawyerLocation = await getLawyerLocation(lawyerId);

    if (!lawyerLocation) {
      return res.status(404).json({ error: "Lawyer location not found" });
    }

    return res.status(200).json(lawyerLocation);
  } catch (error) {
    console.error("Error getting lawyer's location:", error);
    return res.status(500).json({ error: "Failed to get lawyer's location" });
  }
}

// Controller function to update lawyer location
export async function updateLawyerLocationHandler(req: Request<{}, {}, UpdateLawyerLocationInput["body"]>, res: Response) {
  const lawyerId = res.locals.user.lawyer_id;
  const { bar_name } = req.body;

  try {
    const success = await updateLawyerLocation(lawyerId, bar_name);

    if (success) {
      return res.status(200).json({ message: "Lawyer location updated successfully." });
    } else {
      return res.status(500).json({ error: "Failed to update lawyer location." });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to update lawyer location.", message: error.message });
  }
}
