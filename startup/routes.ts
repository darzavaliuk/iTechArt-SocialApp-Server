import {Express} from "express";
import user from "../routes/user";
import post from "../routes/post";

export function routes(app: Express) {
    app.use("/api/v1", user);
    app.use("/api/v1", post);
}

