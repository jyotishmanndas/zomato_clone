import axios from "axios";
import { Request, Response } from "express";

export const locationController = async (req: Request, res: Response) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ msg: "lat and lng is required" })
        };

        const latNum = Number(lat);
        const lngNum = Number(lng);

        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    format: "json",
                    lat: latNum,
                    lon: lngNum,
                },
                headers: {
                    "User-Agent": "zomato/1.0 (jdas.random@gmail.com)"
                },
            }
        )
        res.json(data)
    } catch (error) {
        console.log("Error while getting location", error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}