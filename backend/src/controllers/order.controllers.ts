import { Request, Response } from "express";
import { Address } from "../models/address.model";
import { Cart } from "../models/cart.models";
import { Restaurant } from "../models/restaurant.models";
import { Order } from "../models/order.model";
import mongoose from "mongoose";
import { updateOrderStatusSchema } from "../validations/order.validation";
import { getIO } from "../socket/socket";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { paymentMethod, addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({ msg: "Address is required" })
        };

        const address = await Address.findOne({
            _id: addressId,
            userId: req.user?._id
        });
        if (!address) {
            return res.status(404).json({ success: false, msg: "Address not found" })
        };

        const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371;
            const dlat = ((lat2 - lat1) * Math.PI) / 180;
            const dlon = ((lon2 - lon1) * Math.PI) / 180;

            const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return +(R * c).toFixed(2)
        };

        const cartItems = await Cart.findOne({
            ownerId: req.user?._id
        })
            .populate("items.itemId")
            .populate("restaurantId")

        if (!cartItems) {
            return res.status(404).json({ msg: "Cart not found" })
        };

        const restaurant = await Restaurant.findById(cartItems.restaurantId._id.toString());
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found with this id" })
        };
        if (!restaurant.isOpen) {
            return res.status(404).json({ msg: "Sorry this restaurant is closed for now" })
        };

        const distance = getDistanceKm(
            address.location.coordinates[1],
            address.location.coordinates[0],
            restaurant.autoLocation.coordinates[1],
            restaurant.autoLocation.coordinates[0]
        );

        let subtotal = 0;

        const orderItems = cartItems.items.map((cart) => {
            const item = cart.itemId as any;
            if (!item) {
                throw new Error("Item not found");
            };

            const itemTotal = item.price * cart.quantity;
            subtotal += itemTotal

            return {
                ItemId: item._id.toString(),
                name: item.name,
                price: item.price,
                quantity: cart.quantity,
            };
        });

        const deliveryFee = subtotal < 300 ? 40 : 0;
        const tax = Math.round(subtotal * 0.05);
        const totalAmount = subtotal + deliveryFee + tax;

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const [longitude, latitude] = address.location.coordinates;

        const riderAmount = Math.round(distance * 17);

        const order = await Order.create({
            userId: req.user?._id,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name,
            riderId: null,
            distance,
            riderAmount,
            items: orderItems,
            subtotal,
            deliveryFee,
            tax,
            total: totalAmount,
            addressId: address._id.toString(),
            deliveryAddress: {
                formattedAddress: address.formattedAddress,
                mobile: address.mobile,
                latitude,
                longitude
            },
            paymentMethod,
            paymentStatus: "pending",
            status: "pending",
            expiresAt
        });

        return res.status(200).json({
            success: true,
            msg: "Order created successfully",
            orderId: order._id,
            amount: totalAmount
        })
    } catch (error) {
        console.log("Error while create order", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

// export const fetchOrderForPayment = async (req: Request, res: Response) => {
//     try {
//         if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
//             return res.status(403).json({ msg: "Forbidden" })
//         };

//         const order = await Order.findById(req.params.id);
//         if (!order) {
//             return res.status(404).json({ msg: "Order not found" })
//         };

//         if (order.paymentStatus !== "pending") {
//             return res.status(400).json({ msg: "Order already paid" })
//         };

//         return res.json({
//             orderId: order._id,
//             amount: order.total,
//             currency: "INR"
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Internal server error" })
//     }
// };


export const fetchedRestaurantOrders = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { restaurantId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(restaurantId as string)) {
            return res.status(400).json({ msg: "Invalid restaurant Id format" })
        };

        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) | 1;

        const skip = (page - 1) * limit;

        const orders = await Order.find({
            restaurantId,
            paymentStatus: "paid"
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)

        return res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.log("Error while fetching orders", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId as string)) {
            return res.status(400).json({ msg: "Invalid order Id format" })
        };

        const parsed = updateOrderStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: true, msg: "Invalid inputs", error: parsed.error.issues })
        };

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: "order not found" })
        };

        if (order.paymentStatus !== "paid") {
            return res.status(400).json({ msg: "order not completed" })
        };

        const restaurant = await Restaurant.findById(order.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        if (req.user._id.toString() !== restaurant.ownerId.toString()) {
            return res.status(401).json({ msg: "You are not allowed to update this user" })
        };

        order.status = parsed.data.status;
        await order.save();

        const io = getIO();

        io.to(`user:${order.userId}`).emit("order:update", { orderId: order._id, status: order.status })

        return res.status(200).json({ success: true, msg: "order status updated successfully", order })
    } catch (error) {
        console.log("Error while update orders", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(403).json({ msg: "Forbidden: customer role required" })
        };

        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const orders = await Order.find({
            userId: req.user?._id,
            paymentStatus: "paid"
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)

        return res.status(200).json({ success: true, orders })
    } catch (error) {
        console.log("Error while fetching orders for customer", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const fetchedSingleOrder = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(403).json({ msg: "Forbidden: customer role required" })
        };

        const { orderId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(orderId as string)) {
            return res.status(400).json({ msg: "Invalid order Id format" })
        };
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: "order not found" })
        };

        if (order.userId.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ msg: "You are not allowed to view this order" })
        }

        return res.status(200).json({ success: true, order })
    } catch (error) {
        console.log("Error while fetching single order for customer", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}