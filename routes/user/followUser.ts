import {catchAsyncError} from "../../middleware/catchAsyncError";
import {User} from "../../model/user";
import {NextFunction, Request, Response} from "express";
import {IUser} from "../../types/User";

interface AuthenticatedRequest extends Request {
    user: IUser;
}

export const followUnfollowUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const loggedInUser = req.user;
        const {followUserId} = req.body;

        const isFollowedBefore = loggedInUser.following.find(
            (item) => item.userId === followUserId
        );
        const loggedInUserId = loggedInUser._id;

        if (isFollowedBefore) {
            await User.updateOne(
                {_id: followUserId},
                {$pull: {followers: {userId: loggedInUserId}}}
            );

            await User.updateOne(
                {_id: loggedInUserId},
                {$pull: {following: {userId: followUserId}}}
            );

            res.status(200).json({
                success: true,
                message: "User unfollowed successfully",
            });
        } else {
            await User.updateOne(
                {_id: followUserId},
                {$push: {followers: {userId: loggedInUserId}}}
            );

            await User.updateOne(
                {_id: loggedInUserId},
                {$push: {following: {userId: followUserId}}}
            );

            res.status(200).json({
                success: true,
                message: "User followed successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
});
