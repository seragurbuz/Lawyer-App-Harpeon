import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import log from "./utils/logger";
import {connect} from "./utils/connectToDb";
import cityRouter from "./routes/cityRoutes";
import barRouter from "./routes/barRoutes";
import lawyerRouter from "./routes/lawyerRoutes";
import authRouter from "./routes/authRoutes";
import starRouter from "./routes/starRoutes";
import jobRouter from "./routes/jobRoutes";
import offerRouter from "./routes/offerRoutes";
import deserializeUser from "./middlewares/deserializeUser";
import swaggerDocs from "./utils/swagger";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(deserializeUser);

app.use(cityRouter);
app.use(barRouter);
app.use(lawyerRouter);
app.use(authRouter);
app.use(starRouter);
app.use(jobRouter);
app.use(offerRouter);

const port = config.get<number>("port");

app.listen(port, () => {
    log.info(`App started at http://localhost:${port}`);

    connect();
    
    swaggerDocs(app, port);

})