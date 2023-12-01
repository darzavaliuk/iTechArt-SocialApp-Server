import Post from "../../model/Post";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Response, Request} from "express";

export const getAllPosts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().sort({
            createdAt: -1,
        });

        res.status(201).json({ success: true, posts });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
