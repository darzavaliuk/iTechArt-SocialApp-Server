// @ts-nocheck
import {catchAsyncError} from "../../middleware/catchAsyncError";
import Post from "../../model/Post";
import {NextFunction, Response} from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string
    };
}

export const updateRepliesReplyLike = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {postId, replyId, singleReplyId, replyTitle} = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const replyObject = post.replies.find(
            (reply) => reply._id.toString() === replyId
        );

        if (!replyObject) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        const reply = replyObject.reply.find(
            (reply) => reply._id.toString() === singleReplyId
        );

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        const isLikedBefore = reply.likes.some(
            (like) => like.userId === req.user.id
        );

        if (isLikedBefore) {
            reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Like removed from reply successfully",
            });
        }

        const newLike = {
            name: req.user.name,
            userName: req.user.userName,
            userId: req.user.id,
            userAvatar: req.user.avatar.url,
        };


        reply.likes.push(newLike);

        if (req.user.id !== post.user._id) {
            await Notification.create({
                creator: req.user,
                type: "Like",
                title: replyTitle ? replyTitle : "Liked your Reply",
                userId: post.user._id,
                postId: postId,
            });
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Like added to reply successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});

