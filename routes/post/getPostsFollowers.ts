import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import Post from "../../model/Post";
import {User} from "../../model/user";

interface AuthenticatedRequest extends Request {
    user: {
        id: string
    };
}

export const getPostsFollowers = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        let followingIds

        if (user)
            followingIds = user.following.map((follow) => follow.userId);

        const posts = await Post.find({"user._id": {$in: followingIds}})
            .sort({createdAt: -1})
            .exec();
        res.status(201).json({success: true, posts});
    } catch (error) {
        return
    }
})
