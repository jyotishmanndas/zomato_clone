import http from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";
import { Restaurant } from "../models/restaurant.models";

let io: Server

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            // origin: "http://localhost:5173",
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.use(socketAuthMiddleware);

    io.on("connection", async (socket) => {
        const user = socket.data.user;

        socket.join(`user:${user._id}`);

        if (user.role === "seller") {
            const restaurant = await Restaurant.findOne({ ownerId: user._id });
            if (restaurant) {
                socket.join(`restaurant:${restaurant._id}`)
            }
        };

        console.log("user connected", socket.data.user._id);
        console.log("socket connected", [...socket.rooms]);

        socket.on("rider:location", ({ userId, latitude, longitude }) => {
            io.to(`user:${userId}`).emit("rider:location", {
                latitude,
                longitude
            });
        });

        socket.on("disconnect", () => {
            console.log(`user disconnected:${user._id}`);

        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }
    return io
} 