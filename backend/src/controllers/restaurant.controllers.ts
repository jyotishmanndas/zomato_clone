import { Request, Response } from "express";
import { imageSchema, restaurantSchema } from "../validations/restaurant.validations";
import { Restaurant } from "../models/restaurant.models";
import { uploadtoIK } from "../utils/imagekit";

export const addRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(400).json({ msg: "Invalid role" })
        };

        const parsed = restaurantSchema.safeParse(req.body);
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
            name: parsed.data.name,
            ownerId: req.user._id.toString(),
        });
        if (exstingRestaurant) {
            return res.status(400).json({ msg: "You already have a restaurant" })
        };

        const uploadImage = await uploadtoIK(image.data.buffer, image.data.originalname);

        const restaurant = await Restaurant.create({
            name: parsed.data.name,
            description: parsed.data.description,
            phone: parsed.data.phone,
            image: uploadImage?.url,
            autoLocation: {
                type: "Point",
                coordinates: parsed.data.autoLocation.coordinates,
                formattedAddress: parsed.data.autoLocation.formattedAddress
            }
        });

        return res.status(201).json({ success: true, msg: "Restaurant created successfully", restaurant })
    } catch (error) {
        console.log("Error while creating restaurant", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}