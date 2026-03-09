import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { createOrder, fetchedRestaurantOrders, fetchedSingleCustomerOrder, getCurrentOrdersForRiders, getMyOrders, updateOrderStatus, updateOrderStatusForRider } from "../controllers/order.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", createOrder);
router.get("/getOrders", getMyOrders);
router.get("/get/:orderId", fetchedSingleCustomerOrder);

router.patch("/update/:orderId", updateOrderStatus);

router.patch("/rider/update/status", updateOrderStatusForRider);
router.get("/getRiderOrders", getCurrentOrdersForRiders);

router.get("/:restaurantId", fetchedRestaurantOrders);


export default router