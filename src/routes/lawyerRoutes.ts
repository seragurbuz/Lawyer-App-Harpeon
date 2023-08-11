import express, {Request, Response } from "express";
import validateResource from "../middlewares/validateResource";
import { createLawyerHandler, getLawyerProfileByIdHandler, updateLawyerProfileHandler, getAvailableLawyersByBarIdHandler, getLawyerLocationHandler, updateLawyerLocationHandler } from "../controllers/lawyerController";
import { createLawyerSchema, updateLawyerLocationSchema, updateLawyerSchema } from "../schemas/lawyerSchema";
import requireUser from "../middlewares/requireUser";

const lawyerRouter = express.Router();

// Route for creating a new lawyer
lawyerRouter.post('/api/register', validateResource(createLawyerSchema), createLawyerHandler);
// Route for getting a lawyer profile by ID
lawyerRouter.get('/api/lawyers/profile/:lawyer_id', requireUser, getLawyerProfileByIdHandler);
// Route for listing available lawyers for a selected bar
lawyerRouter.get('/api/available-lawyers/bar/:bar_id', requireUser, getAvailableLawyersByBarIdHandler);
// Route for updating lawyer profile
lawyerRouter.put('/api/myprofile/update', validateResource(updateLawyerSchema), requireUser, updateLawyerProfileHandler);
// Route for getting lawyer location
lawyerRouter.get('/api/location', requireUser, getLawyerLocationHandler);
// Route for updating lawyer location
lawyerRouter.put('/api/location/update', validateResource(updateLawyerLocationSchema), requireUser, updateLawyerLocationHandler);

export default lawyerRouter;
