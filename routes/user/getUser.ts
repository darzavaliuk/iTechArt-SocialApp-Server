import {User} from "../../model/user";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";

export const getUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(201).json({success: true, user});
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
