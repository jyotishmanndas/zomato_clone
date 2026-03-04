import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "./useRedux";

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (!user) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            return
        };

        if (socketRef.current) return;

        socketRef.current = io("http://localhost:5000", {
            withCredentials: true,
            transports: ["websocket"]
        });

        socketRef.current.on("connect", () => {
            console.log("Socket connected", socketRef.current?.id)
        });

        socketRef.current.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        socketRef.current.on("connect_error", (error) => {
            console.log("Socket Error", error.message);
        });

        return () => {
            socketRef.current?.off();
            socketRef.current?.disconnect();
            socketRef.current = null;
        }

    }, [user]);

    return socketRef
}