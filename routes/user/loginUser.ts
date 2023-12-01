import {catchAsyncError} from "../../middleware/catchAsyncError";
import {User} from "../../model/user";
import {NextFunction, Request, Response} from "express";
import {sendToken} from "../../utils/jwtToken";
import {validateUser} from "../../model/validation/userValidate";

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {error} = validateUser(req.body);
    if (error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User is not find with this email & password",
        });
    }

    // @ts-ignore
    const isPasswordMatched = await user.comparePassword((password));

    if (!isPasswordMatched) {
        return res.status(401).json({
            success: false,
            message: "User is not find with this email & password",
        });
    }

    sendToken(user, 201, res);
});
