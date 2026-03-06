import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IRider extends Document {
    userId: Types.ObjectId;
    picture: string;
    mobile: string;
    aadhaarNumber: string;
    drivingLicenceNumber: string;
    isVerified: boolean;
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    isAvailable: boolean;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date
}

const riderSchema = new Schema<IRider>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    drivingLicenceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

riderSchema.index({location: "2dsphere"})

export const Rider: Model<IRider> = mongoose.model("Rider", riderSchema)