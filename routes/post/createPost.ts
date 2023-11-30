import {catchAsyncError} from "../../middleware/catchAsyncError";
import {v2 as cloudinary} from 'cloudinary'
import Post from "../../model/Post";
import {IUser} from "../../types/User";
import {NextFunction, Request, Response} from "express";

interface Reply {
    user:  IUser;
    title: string;
    image?: {
        public_id: string;
        url: string;
    };
    createdAt: Date;
    likes: {
        name: string;
        userName: string;
        userId: string;
        userAvatar: string;
    }[];
    reply: Reply[];
}

interface AuthenticatedRequest extends Request {
    user: IUser;
}

export const createPost = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {image} = req.body;
        let myCloud;

        if (image) {
            myCloud = await cloudinary.uploader.upload(image, {
                folder: "posts",
            });
        }

        let replies = req.body.replies.map((item: Reply) => {
            if (item.image) {
                const replyImage = cloudinary.uploader.upload(item.image, {
                    folder: "posts",
                });
                item.image = {
                    public_id: replyImage.public_id,
                    url: replyImage.secure_url,
                };
            }
            return item;
        });

        const post = new Post({
            title: req.body.title,
            image: image
                ? {
                    public_id: myCloud!.public_id,
                    url: myCloud!.secure_url,
                }
                : null,
            user: req.body.user,
            replies,
        });

        await post.save();

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {

    }
});
