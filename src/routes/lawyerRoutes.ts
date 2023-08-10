import express, {Request, Response } from "express";
import validateResource from "../middlewares/validateResource";
import { createLawyerHandler, getLawyerProfileByIdHandler, updateLawyerProfileHandler, getAvailableLawyersByBarIdHandler } from "../controllers/lawyerController";
import { createLawyerSchema, updateLawyerSchema } from "../schemas/lawyerSchema";
import requireUser from "../middlewares/requireUser";

const lawyerRouter = express.Router();

// Route for creating a new lawyer
lawyerRouter.post('/api/register', validateResource(createLawyerSchema), createLawyerHandler);
// Route for getting a lawyer profile by ID
lawyerRouter.get('/api/lawyers/profile/:lawyer_id', requireUser, getLawyerProfileByIdHandler);
// Route for listing available lawyers for a selected bar
lawyerRouter.get('/api/lawyers/bar/:bar_id', requireUser, getAvailableLawyersByBarIdHandler);
// Route for updating a lawyer profile
lawyerRouter.put('/api/myprofile/update', validateResource(updateLawyerSchema), requireUser, updateLawyerProfileHandler);

export default lawyerRouter;
