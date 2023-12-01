import Post from "../../model/Post";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import Notification from "../../model/Notification"

export const updateLikes = catchAsyncError(async (req: any, res: any, next: any) => {
    try {
        const postId = req.body.postId;

        const post = await Post.findById(postId);
        let isLikedBefore

        if (post)
            isLikedBefore = post.likes.find(
                (item) => item.userId === req.user.id
            );

        if (isLikedBefore) {
            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: {
                        userId: req.user.id,
                    },
                },
            });

            if (req.user.id !== post!.user._id) {
                await Notification.deleteOne({
                    "creator._id": req.user.id,
                    userId: post!.user._id,
                    type: "Like",
                });
            }

            res.status(200).json({
                success: true,
                message: "Like removed successfully",
            });
        } else {
            await Post.updateOne(
                {_id: postId},
                {
                    $push: {
                        likes: {
                            name: req.user.name,
                            userName: req.user.userName,
                            userId: req.user.id,
                            userAvatar: req.user.avatar.url,
                            postId,
                        },
                    },
                }
            );

            if (post && req.user.id !== post.user._id) {
                await Notification.create({
                    creator: req.user,
                    type: "Like",
                    title: post.title ? post.title : "Liked your post",
                    userId: post.user._id,
                    postId: postId,
                });
            }

            res.status(200).json({
                success: true,
                message: "Like Added successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
