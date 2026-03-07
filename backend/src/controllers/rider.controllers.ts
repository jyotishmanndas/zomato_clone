import { Request, Response } from "express";
import { imageSchema, riderSchema } from "../validations/rider.validation";
import { uploadtoIK } from "../utils/imagekit";
import { Rider } from "../models/rider.model";
import axios from "axios";
import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { getIO } from "../socket/socket";

export const addRiderProfile = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "rider") {
            return res.status(401).json({ msg: "Forbidden:, rider role is required" })
        };

        const body = { ...req.body };
        if (typeof body.location === "string") {
            try {
                body.location = JSON.parse(body.location)
            } catch (error) {
                body.location = req.body.location
            }
        }

        const parsed = riderSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, msg: "Invalid inputs", error: parsed.error.issues })
        }

        const imageFileObj = req.file;
        if (!imageFileObj) {
            return res.status(400).json({ msg: "Rider Image is required" })
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
        };

        const existingRider = await Rider.findOne({
            userId: req.user._id
        })
        if (existingRider) {
            return res.status(400).json({
                msg: "Rider profile already exists"
            });
        };

        const uploadImage = await uploadtoIK(image.data.buffer, image.data.originalname);
        if (!uploadImage?.url) {
            return res.status(500).json({ msg: "Rider Image upload failed" });
        };

        const rider = await Rider.create({
            userId: req.user._id,
            picture: uploadImage.url,
            mobile: parsed.data.mobile,
            aadhaarNumber: parsed.data.aadhaarNumber,
            drivingLicenceNumber: parsed.data.drivingLicenceNumber,
            isVerified: false,
            location: {
                type: "Point",
                coordinates: parsed.data.location.coordinates
            },
            isAvailable: false
        });

        return res.status(201).json({ success: true, msg: "Rider profile created successfully", rider })
    } catch (error) {
        console.log("Error while creating rider profile", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const getRiderProfile = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "rider") {
            return res.status(401).json({ msg: "Forbidden:, rider role is required" })
        };

        const rider = await Rider.findOne({
            userId: req.user._id
        });
        if (!rider) {
            return res.status(404).json({ msg: "rider profile not found" })
        };

        return res.status(200).json({ rider })
    } catch (error) {
        console.log("Error while fetching rider profile", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const toogleRiderAvailability = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "rider") {
            return res.status(401).json({ msg: "Forbidden:, rider role is required" })
        };

        const { isAvailable, latitude, longitude } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({ msg: "isAvailaible must be boolean" })
        };

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ msg: "Location is required" })
        };

        const rider = await Rider.findOne({
            userId: req.user._id
        });
        if (!rider) {
            return res.status(404).json({ msg: "rider profile not found" })
        };

        if (isAvailable && !rider.isVerified) {
            return res.status(403).json({ msg: "Rider is not verified" })
        };

        rider.isAvailable = isAvailable;
        rider.location = {
            type: "Point",
            coordinates: [longitude, latitude]
        },
            rider.lastActiveAt = new Date();
        await rider.save();

        return res.status(200).json({ msg: isAvailable ? "Rider is now online" : "Rider is now offline", rider })
    } catch (error) {
        console.log("Error while toogle rider profile", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const accepOrder = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "rider") {
            return res.status(403).json({ msg: "Forbidden: rider role required" })
        };

        const { orderId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(orderId as string)) {
            return res.status(400).json({ msg: "Order id is not valid" })
        };

        const rider = await Rider.findOne({
            userId: req.user?._id,
            isVerified: true,
            isAvailable: true
        });
        if (!rider) {
            return res.status(404).json({ msg: "rider not found" })
        };

        const order = await Order.findOneAndUpdate(
            { _id: orderId, riderId: null },
            {
                riderId: rider.userId,
                riderName: req.user?.name,
                riderPhone: rider.mobile,
                status: "rider_assigned"
            }
        );
        if (!order) {
            return res.status(404).json({ msg: "Order not found" })
        };

        await Rider.findByIdAndUpdate(rider._id, {
            isAvailable:false
        })

        const io = getIO();

        io.to(`user:${order.userId}`).emit("order:rider_assigned", order);

        io.to(`restaurant:${order.restaurantId}`).emit("order:rider_assigned", order);

        return res.status(200).json({ success: true, msg: "Rider assigned successfully", order })
    } catch (error) {
        console.log("Error while riser assign", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}