import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {SubTarget, Target, User} from "../../model/user";

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

    const subTargets = targets.map((subtarget) => ({
        ...subtarget,
        userId: req.user.id,
    }));

    const newTarget = new Target({
        name: req.body.subtitle,
        userId: req.user.id,
        subTargets: subTargets,
    });

    // const target = await Target.findOne({ name: title });

    // target!.subTargets.push(targets)

    for (const subtarget of subTargets) {
        const newSubTarget = new SubTarget(subtarget);
        await newSubTarget.save();
    }

    await newTarget.save();

    res.status(200).json({
        success: true,
        user,
    });
});
