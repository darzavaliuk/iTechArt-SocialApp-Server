import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {User} from "../../model/user";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const setTarget = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User is not find with this email & password",
        });
    }

    let targets = req.body.subtargets;

    targets.map((item: any) => {
        item.timeOrNumbers[item.timeOrNumbers.length - 1].timestamp = new Date();
    })

    let id = req.body.id
    const target = user.target.id(id);

    if (target) {
        target.subTargets = [...targets]
    }

    await user.save();

    res.status(200).json({
        success: true,
        user,
    });
})
