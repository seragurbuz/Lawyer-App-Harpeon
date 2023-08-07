import express, {Request, Response } from "express";
import validateResource from "../middlewares/validateResource";
import { createLawyerHandler, getLawyerProfileByIdHandler, updateLawyerProfileHandler, getAvailableLawyersByBarIdHandler} from "../controllers/lawyerController";
import { createLawyerSchema, updateLawyerSchema } from "../schemas/lawyerSchema";
import requireUser from "../middlewares/requireUser";
import requireOwnProfile from "../middlewares/requireOwnProfile";

const lawyerRouter = express.Router();

lawyerRouter.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

// Route for creating a new lawyer
lawyerRouter.post('/api/lawyers', validateResource(createLawyerSchema), createLawyerHandler);

// Route for getting a lawyer profile by ID
lawyerRouter.get('/api/lawyers/profile/:lawyer_id', requireUser, getLawyerProfileByIdHandler);

// Route for listing available lawyers for a selected bar
lawyerRouter.get('/api/lawyers/bar/:bar_id', requireUser, getAvailableLawyersByBarIdHandler);

// Route for updating a lawyer profile
lawyerRouter.put('/api/profile/:lawyer_id', validateResource(updateLawyerSchema), requireOwnProfile, updateLawyerProfileHandler);

export default lawyerRouter;
