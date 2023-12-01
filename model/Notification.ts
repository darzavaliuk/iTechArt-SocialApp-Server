import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        creator: {
            type: Object,
        },
        type: {
            type: String,
        },
        title: {
            type: String,
        },
        postId: {
            type: String,
        },
        userId: {
            type: String,
        }
    }, {timestamps: true}
);

export default mongoose.model("Notification", notificationSchema);
