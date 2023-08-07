import express from "express";
import { getBarsByCityIdHandler } from "../controllers/barController";
import requireUser from "../middlewares/requireUser";

const barRouter = express.Router();
barRouter.get('/api/bars/:city_id', requireUser, getBarsByCityIdHandler);

export default barRouter;