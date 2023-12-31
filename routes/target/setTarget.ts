import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {SubTarget, Target, User} from "../../model/user";

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

    targets = targets.map((subtarget) => ({
        ...subtarget,
        userId: req.user.id,
    }));


    targets.map((item: any) => {
        item.timeOrNumbers[item.timeOrNumbers.length - 1].timestamp = new Date();
    })


    let id = req.body.id
    const target = await Target.findById(id);
    if (!target) {
        return res.status(404).json({ error: "Target not found" });
    }

    console.log(target)
    if (target) {
        target.subTargets = [...targets]
    }

    console.log(target)

    for (const subtarget of target.subTargets) {
        const newSubTarget = new SubTarget(subtarget);
        await newSubTarget.save();
    }

    await target.save();

    res.status(200).json({
        success: true,
        user,
    });
})
