import { Request, Response } from "express";
import { addressSchema } from "../validations/address.validation";
import { Address } from "../models/Address.model";
import mongoose from "mongoose";

export const addAddress = async (req: Request, res: Response) => {
    try {
        const parsed = addressSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, msg: "Invalid imputs", error: parsed.error.issues });
        };

        const address = await Address.create({
            userId: req.user?._id,
            mobile: parsed.data.mobile,
            formattedAddress: parsed.data.formattedAddress,
            location: {
                type: parsed.data.location.type,
                coordinates: parsed.data.location.coordinates
            }
        });

        return res.status(201).json({ success: true, msg: "Address added successfully", address })
    } catch (error) {
        console.log("error while adding address", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { addressId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(addressId as string)) {
            return res.status(400).json({ msg: "Invalid address Id request" })
        };

        const address = await Address.findOne({
            _id: addressId,
            userId: req.user?._id
        });
        if (!address) {
            return res.status(404).json({ success: false, msg: "Address not found" })
        };

        await address.deleteOne();
        return res.status(200).json({ success: true, msg: "Address deleted successfully" })
    } catch (error) {
        console.log("error while deleting address", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
};

export const getAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.find({
            userId: req.user?._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({ success: true, msg: "Address fetched successfully", address })
    } catch (error) {
        console.log("error while fetching address", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}