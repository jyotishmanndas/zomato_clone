export interface AuthUser {
    id: string;
    name: string;
    email: string;
    profile: string;
    role: string | null;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    formattedAddress: string
}

export interface Restaurant {
    name: string;
    description: string;
    image: string;
    phone: string;
    ownerId: string;
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

export const ACTIVE_STATUSES = ["confirmed", "accepted", "preparing", "ready_for_rider", "rider_assigned", "picked_up"]

type Status = "confirmed" | "pending" | "accepted" | "preparing" | "ready_for_rider" | "rider_assigned" | "picked_up" | "delivered" | "cancelled"

type PaymentStatus = "pending" | "paid" | "failed"

interface Items {
    ItemId: string;
    name: string;
    price: number;
    quantity: number
}

export interface IOrder {
    _id: string;
    userId: string;
    restaurantId: string;
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


export interface IRider {
    _id: string
    picture: string;
    mobile: string;
    aadhaarNumber: string;
    drivingLicenceNumber: string;
    isVerified: boolean;
    isAvailable: boolean
}