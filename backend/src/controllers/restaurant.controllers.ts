import { Request, Response } from "express";
import { imageSchema, restaurantSchema } from "../validations/restaurant.validations";
import { Restaurant } from "../models/restaurant.models";
import { uploadtoIK } from "../utils/imagekit";

export const addRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(403).json({ msg: "Forbidden: seller role required" })
        };

        const body = { ...req.body};
        if(typeof body.autoLocation === "string"){
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
}