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

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16b" }))
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/location", locationRoutes);

export default app;