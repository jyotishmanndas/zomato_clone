import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.models";
import { Rider } from "../models/rider.model";
import mongoose from "mongoose";

export const getPendingRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.find({
            isVerified: false
        });

        return res.status(200).json({
            count: restaurant.length,
            restaurant
        })
    } catch (error) {
        console.log("Error while getting the restaurants", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const getPendingRiders = async (req: Request, res: Response) => {
    try {
        const rider = await Rider.find({
            isVerified: false
        });

        return res.status(200).json({
            count: rider.length,
            rider
        })
    } catch (error) {
        console.log("Error while getting the restaurants", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};


export const verifyRestaurant = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "seller") {
            return res.status(401).json({ msg: "Forbibben, Only seller can verify themselves" })
        };

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ msg: "Invalid restaurant id format" })
        };

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" })
        };

        restaurant.isVerified = true;
        await restaurant.save();

        return res.status(200).json({ success: true, msg: "Restaurant verified successfully" })

    } catch (error) {

    }
};

export const verifyRider = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "rider") {
            return res.status(401).json({ msg: "Forbibben, Only rider can verify themselves" })
        };

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ msg: "Invalid rider id format" })
        };

        const rider = await Rider.findById(id);
        if (!rider) {
            return res.status(404).json({ msg: "Rider not found" })
        };

        rider.isVerified = true;
        await rider.save();

        return res.status(200).json({ success: true, msg: "Rider verified successfully" })

    } catch (error) {

    }
};