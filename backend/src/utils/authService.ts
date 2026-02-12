import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const createAccessToken = (userId: string, role?: string) => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" })
};

export const createRefreshToken = (userId: string, role?: string) => {
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "3d" })
};