import { Request, Response } from "express";
import { imageSchema, restaurantSchema, updateRestaurantDetails } from "../validations/restaurant.validations";
import { Restaurant } from "../models/restaurant.models";
import { uploadtoIK } from "../utils/imagekit";
import mongoose from "mongoose";

export const addRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const body = { ...req.body };
        if (typeof body.autoLocation === "string") {
            try {
                body.autoLocation = JSON.parse(body.autoLocation)
            } catch (error) {
                body.autoLocation = req.body.autoLocation
            }
        }

        const parsed = restaurantSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs", error: parsed.error.issues })
        };

        const imageFileObj = req.file;
        if (!imageFileObj) {
            return res.status(400).json({ msg: "Image is required" })
        };

        const imageMetaData = {
            originalname: imageFileObj.originalname,
            mimetype: imageFileObj.mimetype,
            size: imageFileObj.size,
            buffer: imageFileObj.buffer
        };

        const image = imageSchema.safeParse(imageMetaData);
        if (!image.success) {
            return res.status(400).json({ msg: "Invalid file metadata" })
        }

        const exstingRestaurant = await Restaurant.findOne({
            ownerId: req.user._id.toString(),
        });
        if (exstingRestaurant) {
            return res.status(400).json({ msg: "You already have a restaurant" })
        };

        const uploadImage = await uploadtoIK(image.data.buffer, image.data.originalname);
        if (!uploadImage?.url) {
            return res.status(500).json({ msg: "Image upload failed" });
        };

        const restaurant = await Restaurant.create({
            name: parsed.data.name,
            description: parsed.data.description,
            phone: parsed.data.phone,
            image: uploadImage.url,
            ownerId: req.user._id,
            autoLocation: {
                type: "Point",
                coordinates: parsed.data.autoLocation.coordinates,
                formattedAddress: parsed.data.autoLocation.formattedAddress
            }
        });

        return res.status(201).json({ success: true, msg: "Restaurant created successfully", restaurant })
    } catch (error) {
        console.log("Error creating restaurant", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const getMyRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const restaurant = await Restaurant.findOne({
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "No Restaurant found" })
        };

        return res.status(200).json({ msg: "Restaurant fetched", restaurant })
    } catch (error) {
        console.log("Error white fetching restaurant", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const updateRestaurantStatus = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({ msg: "restaurantId is required" })
        };

        if (!mongoose.Types.ObjectId.isValid(restaurantId as string)) {
            return res.status(400).json({ msg: "Invalid Restaurant ID format" });
        };

        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            ownerId: req.user._id
        });
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found or not owned by user" })
        };

        restaurant.isOpen = !restaurant.isOpen;
        await restaurant.save()

        return res.status(200).json({ success: true, msg: "Status updated successfully", restaurant })
    } catch (error) {
        console.log("Error while updating restaurant status", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({ msg: "restaurantId is required" })
        };

        if (!mongoose.Types.ObjectId.isValid(restaurantId as string)) {
            return res.status(400).json({ msg: "Invalid Restaurant ID format" });
        };

        const parsed = updateRestaurantDetails.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs", issues: parsed.error.issues })
        };

        const updateBody: any = {};

        if (parsed.data.name) updateBody.name = parsed.data.name;
        if (parsed.data.description) updateBody.description = parsed.data.description;
        if (parsed.data.phone) updateBody.phone = parsed.data.phone;

        const restaurant = await Restaurant.findOneAndUpdate({
            _id: restaurantId,
            ownerId: req.user._id
        }, {
            $set: updateBody
        });
        if (!restaurant) {
            return res.status(404).json({
                msg: "Restaurant not found or not owned by user"
            });
        }

        return res.status(200).json({success: true, msg: "Details updtaed successully", restaurant})
    } catch (error) {
        console.log("Error while updating restaurant details", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}