import mongoose, { Document, Model, Schema } from "mongoose";

type Role = "customer" | "rider" | "seller"

export interface IUser extends Document {
    name: string,
    email: string,
    profile: string,
    role: Role | null,
    refreshToken: string,
    googleId: string,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String
    },
    role: {
        type: String,
        enum: ["customer", "rider", "seller"],
        default: null
    },
    refreshToken: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        required: true
    },
}, {
    timestamps: true
});

export const User: Model<IUser> = mongoose.model("User", userSchema)