import {catchAsyncError} from "../../middleware/catchAsyncError";
import Notification from "../../model/Notification";
import {NextFunction, Request, Response} from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const getNotification = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort(
            { createdAt: -1 }
        );

        res.status(201).json({
            success: true,
            notifications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
