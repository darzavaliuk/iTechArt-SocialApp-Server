import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        image: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        user: {
            type: Object,
        },
        likes: [
            {
                name: {
                    type: String,
                },
                userName: {
                    type: String,
                },
                userId: {
                    type: String,
                },
                userAvatar: {
                    type: String,
                },
            },
        ],
        replies: [
            {
                user: {
                    type: Object,
                },
                title: {
                    type: String,
                },
                image: {
                    public_id: {
                        type: String,
                    },
                    url: {
                        type: String,
                    },
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                likes: [
                    {
                        name: {
                            type: String,
                        },
                        userName: {
                            type: String,
                        },
                        userId: {
                            type: String,
                        },
                        userAvatar: {
                            type: String,
                        },
                    },
                ],
                reply: [
                    {
                        user: {
                            type: Object,
                        },
                        title: {
                            type: String,
                        },
                        image: {
                            public_id: {
                                type: String,
                            },
                            url: {
                                type: String,
                            },
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                        likes: [
                            {
                                name: {
                                    type: String,
                                },
                                userName: {
                                    type: String,
                                },
                                userId: {
                                    type: String,
                                },
                                userAvatar: {
                                    type: String,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);
