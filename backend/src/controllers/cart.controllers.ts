import { Request, Response } from "express";
import mongoose from "mongoose";
import { Menu } from "../models/menu.model";
import { Cart } from "../models/cart.models";
import { Restaurant } from "../models/restaurant.models";

export const addToCartController = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(400).json({ msg: "Your are not allowed to do this" })
        };

        const { restaurantId, itemId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ msg: "Invalid restaurant or item Id" })
        };

        const userId = req.user?._id;

        const menuItem = await Menu.findOne({
            _id: itemId,
            restaurantId: restaurantId
        });

        if (!menuItem) {
            return res.status(404).json({ msg: "Item not found" })
        };

        const cartFromDifferentRestaurant = await Cart.findOne({
            ownerId: userId,
            restaurantId: {
                $ne: restaurantId
            }
        });

        if (cartFromDifferentRestaurant) {
            return res.status(400).json({ msg: "You can order from only one restaurant at a time. Please clear your cart first to add items from this restaurant" })
        };

        const updatedCart = await Cart.findOneAndUpdate(
            { ownerId: userId, restaurantId, "items.itemId": itemId },
            {
                $inc: {
                    "items.$.quantity": 1
                },
            },
        );

        if (updatedCart) {
            return res.status(200).json({ msg: "Item quantity updated", cart: updatedCart })
        };

        const cart = await Cart.findOneAndUpdate(
            { ownerId: userId },
            {
                $set: { ownerId: userId, restaurantId },
                $push: { items: { itemId, quantity: 1 } }
            },
            { upsert: true }
        );

        return res.status(201).json({ msg: "Item added to cart", cart });
    } catch (error) {
        console.error("Add to cart error", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const incrementCartController = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(400).json({ msg: "You are not allowed to do this action" })
        };

        const { itemId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ msg: "Invalid restaurant or item Id" })
        };

        const menuItem = await Menu.findOne({
            _id: itemId
        });
        if (!menuItem) {
            return res.status(400).json({ msg: "Item not found" })
        };

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId
        });
        if (!restaurant) {
            return res.status(400).json({ msg: "Restaurant not found" })
        };

        const cart = await Cart.findOneAndUpdate(
            { ownerId: req.user._id, "items.itemId": itemId },
            {
                $inc: {
                    "items.$.quantity": 1
                }
            }
        );

        if (!cart) {
            return res.status(400).json({ msg: "Item not in cart" })
        };

        return res.status(200).json({ msg: "Item quantity increased", cart })
    } catch (error) {
        console.error("increment cart error", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const decrementCartController = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(400).json({ msg: "You are not allowed to do this action" })
        };

        const { itemId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ msg: "Invalid restaurant or item Id" })
        };

        const menuItem = await Menu.findOne({
            _id: itemId
        });
        if (!menuItem) {
            return res.status(400).json({ msg: "Item not found" })
        };

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId
        });
        if (!restaurant) {
            return res.status(400).json({ msg: "Restaurant not found" })
        };

        const cart = await Cart.findOne({
            ownerId: req.user._id
        });
        if (!cart) {
            return res.status(400).json({ msg: "no cart found" })
        };

        const item = cart.items.find((i) => i.itemId.toString() === itemId)
        if (!item) {
            return res.status(404).json({ msg: "Item not in cart" });
        }

        if (item.quantity === 1) {
            const updatedCart = await Cart.findOneAndUpdate(
                { ownerId: req.user._id },
                { $pull: { items: { itemId } } }
            );

            return res.json({
                msg: "Item removed from cart",
                cart: updatedCart
            });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { ownerId: req.user._id, "items.itemId": itemId },
            {
                $inc: {
                    "items.$.quantity": -1
                }
            }
        );

        return res.status(200).json({ msg: "Item quantity decreased", cart: updatedCart })
    } catch (error) {
        console.error("decrement cart error", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getCartController = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "customer") {
            return res.status(403).json({ msg: "Forbidden" })
        };

        const cart = await Cart.findOne({
            ownerId: req.user?._id
        })
            .populate("items.itemId")
            .populate("restaurantId")

        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" })
        };

        const subTotal = cart.items.reduce((sum, items: any) => (
            sum + items.itemId.price * items.quantity
        ), 0)

        return res.status(200).json({ msg: "cart fetched successfully", cart, subTotal });
    } catch (error) {
        console.log("Error while fetching cart", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const removeCartController = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
            return res.status(400).json({ msg: "Invalid restaurant or item Id" })
        };

        const menuItem = await Menu.findById(itemId);
        if (!menuItem) {
            return res.status(400).json({ msg: "item not found" })
        };

        const cart = await Cart.findOneAndUpdate(
            { ownerId: req.user?._id },
            { $pull: { items: { itemId } } }
        );

        if (!cart) {
            return res.status(400).json({ msg: "Cart not found" })
        };
        return res.status(200).json({ msg: "cart removed successfully", cart });
    } catch (error) {
        console.log("Error while fetching cart", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};