// @ts-nocheck
import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {ErrorHandler} from "../utils/ErrorHandler";
import {User} from "../model/user";
import {catchAsyncError} from "./catchAsyncError";
import {IUser} from "../types/User";

interface AuthenticatedRequest extends Request {
    user: IUser | null;
}

export const isAuthenticatedUser = () => catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || authHeader === 'Bearer undefined' || !authHeader.startsWith("Bearer ")) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    //console.log(req.body)

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    console.log(decoded)
    // @ts-ignore
    req.user = await User.findById(decoded.id);
    next();
});
