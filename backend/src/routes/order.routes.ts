import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { createOrder, fetchedRestaurantOrders, fetchedSingleOrder, getCurrentOrdersForRiders, getMyOrders, updateOrderStatus, updateOrderStatusForRider } from "../controllers/order.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", createOrder);
router.get("/getOrders", getMyOrders);
router.get("/get/:orderId", fetchedSingleOrder);

router.patch("/update/:orderId", updateOrderStatus);
router.get("/:restaurantId", fetchedRestaurantOrders);

router.get("/getRiderOrders", getCurrentOrdersForRiders);
router.patch("/rider/update/status", updateOrderStatusForRider);


export default router