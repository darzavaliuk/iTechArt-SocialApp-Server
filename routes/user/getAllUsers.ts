import {User} from "../../model/user";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const getAllUsers = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const loggedInUser = req.user.id;
    const users = await User.find({_id: {$ne: loggedInUser}}).sort({
        createdAt: -1,
    });

    res.status(201).json({
        success: true,
        users,
    });
});
