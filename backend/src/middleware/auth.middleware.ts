import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.models";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.accessToken;
        const authHeader = req.headers.authorization;

        if (!token && authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        };

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized request" })
        };

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string }
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ msg: "Invalid token" })
        };

        const user = await User.findById(decoded.userId).select("-refreshToken");
        if (!user) {
            return res.status(401).json({ msg: "user not found" })
        };

        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" })
    }
}