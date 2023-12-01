import {User} from "../../model/user";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const userDetails = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User is not find with this email & password",
        });
    }

    res.status(200).json({
        success: true,
        user,
    });
});
