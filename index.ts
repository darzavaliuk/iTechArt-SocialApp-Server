import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as webConfig from './webConfig.json';
import {routes} from './startup/routes';
import {db} from "./startup/db";
import bodyParser from "body-parser";
import {config} from "dotenv";
import {v2 as cloudinary} from 'cloudinary'
import responseTime from "response-time";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

dotenv.config();

const corsOptions = {
    credentials: true,
    origin: webConfig.frontend_url,
    optionsSuccessStatus: 200
}

const app: Express = express();
const port = process.env.port;

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const headers = req.headers;
    const routeParams = req.params;

    console.log(`[${timestamp}] ${ip} "${method} ${url}" User-Agent: ${userAgent}`);
    console.log('Headers:', headers);
    console.log('Route Params:', routeParams);

    next();
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

if (process.env.NODE_ENV !== "production") {
    config({
        path: ".env",
    });
}

routes(app);
db();

app.use(
    responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: res.statusCode,
                },
                time * 1000
            );
        }
    })
);

startMetricsServer();

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;

