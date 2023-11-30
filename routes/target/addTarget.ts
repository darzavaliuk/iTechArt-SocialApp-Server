import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {Target, User} from "../../model/user";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const addTarget = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User is not find with this email & password",
        });
    }

    const targets = req.body.subtargets;
    const title = req.body.subtitle;
    const target = await Target.findOne({ name: title });

    target!.subTargets.push(targets);
    await target!.save();

    res.status(200).json({
        success: true,
        user,
    });
});
