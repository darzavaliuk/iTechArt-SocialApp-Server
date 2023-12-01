import {catchAsyncError} from "../../middleware/catchAsyncError";
import Post from "../../model/Post";
import {v2 as cloudinary} from 'cloudinary'
import {NextFunction, Request, Response} from "express";
import {IUser} from "../../types/User";

interface AuthenticatedRequest extends Request {
    user: IUser;
}

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

export const addReplies = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId = req.body.postId;

        let myCloud;

        if (req.body.image) {
            myCloud = await cloudinary.uploader.upload(req.body.image, {
                folder: "posts",
            });
        }

        const replyData: Reply = {
            user: req.user,
            title: req.body.title,
            image: req.body.image
                ? {
                    public_id: myCloud!.public_id,
                    url: myCloud!.secure_url,
                }
                : undefined,
            likes: [],
            reply: [],
            createdAt: new Date()
        };

        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.replies.push(replyData);

        await post.save();

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
