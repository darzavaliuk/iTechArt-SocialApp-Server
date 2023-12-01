import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import Post from "../../model/Post";

interface AuthenticatedRequest extends Request {
    user: {
        id: string
    };
}

export const getPostsUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({"user._id": req.user.id}).sort({
            createdAt: -1,
        });
        res.status(201).json({success: true, posts});
    } catch (error) {
        return
    }
})

export const getPostsUserId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({"user._id": req.params.id}).sort({
            createdAt: -1,
        });
        res.status(201).json({success: true, posts});
    } catch (error) {
        return
    }
})
