import express from 'express';
import { getCitiesHandler } from '../controllers/cityController';
import requireUser from '../middlewares/requireUser';

const cityRouter = express.Router();
cityRouter.get('/api/cities', requireUser, getCitiesHandler);

export default cityRouter;
