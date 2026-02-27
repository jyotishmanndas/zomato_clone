import { Request, Response } from "express";
import { Address } from "../models/Address.model";
import { Cart } from "../models/cart.models";
import { Restaurant } from "../models/restaurant.models";
import { Order } from "../models/order.model";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { paymentMethod, addressId, distance } = req.body;
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

        const riderAmount = Math.ceil(distance) * 17;

        const order = await Order.create({
            userId: req.user?._id,
            restaurantId: restaurant._id.toString(),
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
            status: "placed",
            expiresAt
        })

        await Cart.deleteOne({ ownerId: req.user?._id })

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

export const fetchOrderForPayment = async (req: Request, res: Response) => {
    try {
        if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
            return res.status(403).json({ msg: "Forbidden" })
        };

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" })
        };

        if (order.paymentStatus !== "pending") {
            return res.status(400).json({ msg: "Order already paid" })
        };

        return res.json({
            orderId: order._id,
            amount: order.total,
            currency: "INR"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

