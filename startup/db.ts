import config from "config";
import winston from "winston";
import mongoose from "mongoose";

export function db() {
    mongoose.connect(config.get('db'))
        .then(() => winston.info('Connection to MongoDB established successfully...'));
}
