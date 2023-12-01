import {catchAsyncError} from "../../middleware/catchAsyncError";
import Post from "../../model/Post";
import {NextFunction, Request, Response} from "express";
import {v2 as cloudinary} from 'cloudinary'

export const deletePost = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return
        }

        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }

        await Post.deleteOne({_id: req.params.id});

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
