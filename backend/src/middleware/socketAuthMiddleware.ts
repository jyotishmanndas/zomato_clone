import { Socket } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models";

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
    try {
        const rawCookie = socket.handshake.headers.cookie;
        if (!rawCookie) {
            return next(new Error("No cookie found"))
        };

        const parsedCookies = cookie.parse(rawCookie);

        const token = parsedCookies.accessToken;
        if (!token) {
            return next(new Error("No access Token found"))
        };

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string }
        if (!decoded || !decoded.userId) {
            return next(new Error("invalid token"))
        };

        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new Error("Unauthorized"))
        }

        socket.data.user = decoded.userId;
        next()
    } catch (error) {
        next(new Error("Authentication failed"));
    }
};