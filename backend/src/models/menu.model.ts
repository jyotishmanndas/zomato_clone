import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IMenu extends Document {
    name: string;
    description?: string;
    image: {
        url: string,
        fileId: string
    };
    price: number;
    isAvailable: boolean
    restaurantId: Types.ObjectId;
    createdAt: Date,
    updatedAt: Date
}

const menuSchema = new Schema<IMenu>({
    name: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
    },
    image: {
        url: {
            type: String,
            required: true
        },
        fileId: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    }
}, {
    timestamps: true
});

export const Menu: Model<IMenu> = mongoose.model("Menu", menuSchema)