import mongoose, { Document, Model, Schema, Types } from "mongoose";

type Status = "confirmed" | "pending" | "accepted" | "preparing" | "ready_for_rider" | "rider_assigned" | "picked_up" | "delivered" | "cancelled"

type PaymentStatus = "pending" | "paid" | "failed"

interface Items {
    ItemId: string;
    name: string;
    price: number;
    quantity: number
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    restaurantName: string;
    riderId?: string | null;
    riderPhone: number | null;
    riderName: string | null;
    distance: number;
    riderAmount: number;

    items: Items[];

    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;

    addressId: string;

    deliveryAddress: {
        formattedAddress: string;
        mobile: number;
        latitude: number;
        longitude: number
    };

    status: Status

    paymentId?: string;
    paymentMethod: "razorpay";
    paymentStatus: PaymentStatus;

    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};


const orderSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    riderId: {
        type: String,
        default: null
    },
    riderPhone: {
        type: Number,
        default: null
    },
    riderName: {
        type: String,
        default: null
    },
    riderAmount: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    items: [
        {
            ItemId: String,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    subtotal: Number,
    deliveryFee: Number,
    tax: Number,
    total: Number,

    addressId: {
        type: String,
        required: true
    },
    deliveryAddress: {
        formattedAddress: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },

    status: {
        type: String,
        enum: ["confirmed", "pending", "accepted", "preparing", "ready_for_rider", "rider_assigned", "picked_up", "delivered", "cancelled"],
        default: "pending"
    },

    paymentId: {
        type: String,
    },
    paymentMethod: {
        type: String,
        enum: ["razorpay"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    }
}, {
    timestamps: true
});

export const Order: Model<IOrder> = mongoose.model("Order", orderSchema)