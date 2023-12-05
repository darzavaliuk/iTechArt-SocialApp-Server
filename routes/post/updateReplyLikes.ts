// @ts-nocheck
import {catchAsyncError} from "../../middleware/catchAsyncError";
import Post from "../../model/Post";
import {NextFunction, Request, Response} from "express";
import {IUser} from "../../types/User";

interface AuthenticatedRequest extends Request {
    user: IUser;
}

interface Reply {
    user: IUser;
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
}

export const updateReplyLikes = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const postId = req.body.postId;
        const replyId = req.body.replyId;
        const replyTitle = req.body.replyTitle;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const reply = post.replies.find(
            (reply) => reply._id === replyId
        );

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        const isLikedBefore = reply.likes.find(
            (item) => item.userId === req.user._id
        );

        if (isLikedBefore) {
            reply.likes = reply.likes.filter((like) => like.userId !== req.user._id);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Like removed from reply successfully",
            });
        } else {

            const newLike = {
                name: req.user.name,
                userName: req.user.userName,
                userId: req.user._id,
                userAvatar: req.user.avatar.url,
            };

            reply.likes.push(newLike);

            await post.save();
        }

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
