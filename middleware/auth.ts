import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {User} from "../model/user";
import {catchAsyncError} from "./catchAsyncError";
import {IUser} from "../types/User";

interface AuthenticatedRequest extends Request {
    user: IUser | null;
}

export const isAuthenticatedUser = () => catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader === 'Bearer undefined' || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Please login to continue",
        });
    }

    const token = authHeader!.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // @ts-ignore
    req.user = await User.findById(decoded.id);
    next();
});
