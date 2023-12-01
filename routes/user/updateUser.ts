import {User} from "../../model/user";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {v2 as cloudinary} from 'cloudinary'

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const updateUserAvatar = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let existsUser = await User.findById(req.user.id);

        if (req.body.avatar !== "") {
            const imageId = existsUser?.avatar?.public_id;

            if (imageId)
                await cloudinary.uploader.destroy(imageId);

            const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
            });

            existsUser!.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        await existsUser!.save();

        res.status(200).json({
            success: true,
            user: existsUser,
        });
    } catch (error) {
        return
    }
});

export const updateUserInfo = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);

        user!.name = req.body.name;
        user!.bio = req.body.bio;

        await user!.save();

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return
    }
});
