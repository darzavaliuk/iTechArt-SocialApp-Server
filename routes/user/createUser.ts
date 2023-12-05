import {sendToken} from "../../utils/jwtToken";
import {IUser} from "../../types/User";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {validateCreateUser} from "../../model/validation/userCreateValidate";
import {TypedRequestBody} from "../../types/TypedRequestBody";
import {NextFunction, Response} from "express";
import {User} from "../../model/user";
import {v2 as cloudinary} from 'cloudinary'

export const createUser = catchAsyncError(async (req: TypedRequestBody<IUser>, res: Response, next: NextFunction) => {
    try {
        const {error} = validateCreateUser(req.body);
        if (error)
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });

        const {name, email, password, avatar} = req.body;

        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let myCloud;

        if (avatar) {
            myCloud = await cloudinary.uploader.upload(avatar, {
                folder: "avatars",
            });
        }

        user = await User.create({
            name,
            email,
            password,
            userName: name.replace(/\s/g, "") + Date.now(),
            avatar: avatar
                ? {public_id: myCloud!.public_id, url: myCloud!.secure_url}
                : null,
        });

        sendToken(user, 201, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
