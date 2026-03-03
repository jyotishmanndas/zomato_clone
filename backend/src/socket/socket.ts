import http from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";

export const initSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket)=>{
        const userId = socket.data.user._id;

        socket.join(`user:${userId}`);
    })
}