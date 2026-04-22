import { createServer } from "http"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import menuRoutes from "./routes/menu.routes";
import cartRoutes from "./routes/cart.routes";
import addressRoutes from "./routes/address.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import locationRoutes from "./routes/location.routes";
import riderRoutes from "./routes/rider.routes";
import adminRoutes from "./routes/admin.routes"
import { initSocket } from "./socket/socket";

const app = express();
const server = createServer(app);

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CORS_ORIGIN || ""
    ],
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16b" }))
app.use(cookieParser());

initSocket(server);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/rider", riderRoutes);
app.use("/api/v1/admin", adminRoutes);

export default server;