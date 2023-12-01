import {catchAsyncError} from "../../middleware/catchAsyncError";
import {User} from "../../model/user";
import {sendToken} from "../../utils/jwtToken";
import {validateUser} from "../../model/validation/userValidate";
import {NextFunction, Request, Response} from "express";

export const resetPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {error} = validateUser(req.body);
    if (error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user)
        return res.status(404).json({
            success: false,
            message: "User account not found.",
        });

    user.password = password;
    await user.save();

    res.status(200).json({
        success: true,
        user: user,
    });

    sendToken(user, 201, res);
})
