import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const subTargetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please enter the sub-target name"],
    },
    way: {
        type: String,
    },
    maxValue: {
        type: String,
    },
    timeOrNumbers: [
        {
            value: {
                type: String,
                required: [true, "Please enter the time or number"],
            },
            timestamp: {
                type: Date,
               updatedAt: false
            },
        },
    ],
    userId: {
        type: String,
        required: [true, "Please provide the user ID"],
    },
});

const targetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the target name"],
    },
    subTargets: [subTargetSchema],
});


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your Name"],
        },
        userName: {
            type: String,
        },
        bio: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
        },
        avatar: {
            public_id: {
                type: String,
                required: [true, "Please upload one profile picture"],
            },
            url: {
                type: String,
                required: [true, "Please upload one profile picture"],
            },
        },
        followers: [
            {
                userId: {
                    type: String,
                },
            },
        ],
        following: [
            {
                userId: {
                    type: String,
                },
            },
        ],
        target: [targetSchema],
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
    // @ts-ignore
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.compareCode = async function (enteredCode: string) {
    return enteredCode === this.code;
};

export const User = mongoose.model("User", userSchema);
export const Target = mongoose.model("Target", targetSchema);
export const SubTarget = mongoose.model("SubTarget", subTargetSchema);
