import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import Post from "../../model/Post";

interface AuthenticatedRequest extends Request {
    user: {
        id: string
    };
}

export const getRepliesUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const posts = await Post.find().sort({
            createdAt: -1,
        });
        const myReplies = posts.filter((post: any) =>
            post.replies.some((reply: any) => reply.user._id === userId),
        );

        res.status(201).json({success: true, posts: myReplies});
    } catch (error) {
        return;
    }
})

export const getRepliesUserId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        const posts = await Post.find().sort({
            createdAt: -1,
        });
        const myReplies = posts.filter((post: any) =>
            post.replies.some((reply: any) => reply.user._id === userId),
        );

        res.status(201).json({success: true, posts: myReplies});
    } catch (error) {
        return;
    }
})
