import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICartItem {
    itemId: Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    ownerId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    items: ICartItem[],
    createdAt: Date,
    updatedAt: Date
}

const cartSchema = new Schema<ICart>({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

cartSchema.index({ ownerId: 1 }, { unique: true })

export const Cart: Model<ICart> = mongoose.model("Cart", cartSchema)