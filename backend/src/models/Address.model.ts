import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IAddress extends Document {
    userId: Types.ObjectId;
    mobile: number;
    formattedAddress: string;
    location: {
        type: "Point",
        coordinates: [number, number]
    };
    createdAt: Date,
    updatedAt: Date
}

const addressSchema = new Schema<IAddress>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    formattedAddress: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number, Number],
            required: true
        },
    }
}, {
    timestamps: true
});

addressSchema.index({ location: "2dsphere" })

export const Address: Model<IAddress> = mongoose.model("Address", addressSchema);