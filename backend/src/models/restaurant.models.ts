import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description: string;
    image: string;
    phone: string;
    ownerId: Types.ObjectId;
    isVerified: boolean;
    autoLocation: {
        type: "Point",
        coordinates: [number, number];  //longitude latitude
        formattedAddress: string;
    };
    isOpen: boolean,
    createdAt: Date,
    updatedAt: Date
}


const restaurantSchema = new Schema<IRestaurant>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    autoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number, Number],
            required: true
        },
        formattedAddress: {
            type: String
        }
    },
    isOpen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

restaurantSchema.index({ autoLocation: "2dsphere" });

export const Restaurant: Model<IRestaurant> = mongoose.model("Restaurant", restaurantSchema)