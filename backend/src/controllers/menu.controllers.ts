import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.models";
import { imageSchema, menuSchema, updateMenuItemSchema } from "../validations/menu.validation";
import { deleteFromIk, uploadtoIK } from "../utils/imagekit";
import { Menu } from "../models/menu.model";
import mongoose from "mongoose";

export const addMenuItem = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const restaurant = await Restaurant.findOne({
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        const parsed = menuSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs", error: parsed.error.issues })
        };

        const image = req.file;
        if (!image) {
            return res.status(400).json({ msg: "Image is required" })
        };

        const imageMetaData = {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            buffer: image.buffer
        };

        const imageCheck = imageSchema.safeParse(imageMetaData);
        if (!imageCheck.success) {
            return res.status(400).json({ msg: "Invalid file", error: imageCheck.error.issues })
        };

        const existingItem = await Menu.findOne({
            name: parsed.data.name.toLowerCase(),
            restaurantId: restaurant._id
        });
        if (existingItem) {
            return res.status(400).json({ msg: "Item already exists on the menu" })
        };

        const { buffer, originalname } = imageCheck.data
        const uploadedImages = await uploadtoIK(buffer, originalname)
        if (!uploadedImages?.url || uploadedImages.fileId) {
            return res.status(400).json({ msg: "Menu image upload failed" })
        };

        const menuItem = await Menu.create({
            name: parsed.data.name.toLowerCase(),
            description: parsed.data.description || "",
            image: {
                url: uploadedImages.url,
                fileId: uploadedImages.fileId
            },
            price: parsed.data.price,
            isAvailable: parsed.data.isAvailable || true,
            restaurantId: restaurant._id
        })

        return res.status(201).json({ success: true, msg: "Menu item added", menuItem });
    } catch (error) {
        console.error("Error while adding menu item", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getItmesByRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const restaurant = await Restaurant.findOne({
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        const items = await Menu.find({
            restaurantId: restaurant._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({ msg: "items fetched successfully", items })
    } catch (error) {
        console.error("Error while getting menu items", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateMenuItem = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
            return res.status(400).json({ msg: "Invalid item Id format" })
        };

        const menuItem = await Menu.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({ msg: "Item not found" })
        };

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId,
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        const parsed = updateMenuItemSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs", error: parsed.error.issues })
        };

        if (parsed.data.name) menuItem.name = parsed.data.name;
        if (parsed.data.description) menuItem.description = parsed.data.description;
        if (parsed.data.price) menuItem.price = parsed.data.price;

        await menuItem.save();

        return res.status(200).json({ success: true, msg: "menu item upadted successfully", menuItem })

    } catch (error) {
        console.error("Error while updating menu items", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const toogleMenuItemAvailability = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
            return res.status(400).json({ msg: "Invalid item Id format" })
        };

        const menuItem = await Menu.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({ msg: "Item not found" })
        };

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId,
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        menuItem.isAvailable = !menuItem.isAvailable;
        await menuItem.save();

        return res.status(200).json({ msg: `item marked as ${menuItem.isAvailable ? "available" : "unavailable"}` })

    } catch (error) {
        console.error("Error while updating available menu items", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
            return res.status(400).json({ msg: "Invalid item Id format" })
        };

        const menuItem = await Menu.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({ msg: "Item not found" })
        };

        const restaurant = await Restaurant.findOne({
            _id: menuItem.restaurantId,
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        const fileId = menuItem.image.fileId

        await deleteFromIk([fileId]);
        await menuItem.deleteOne();
        return res.status(200).json({ success: true, msg: "Item deleted successfully" })

    } catch (error) {
        console.error("Error while deleting menu items", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};