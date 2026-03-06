import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { createOrder, fetchedRestaurantOrders, fetchedSingleOrder, getMyOrders, updateOrderStatus } from "../controllers/order.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", createOrder);
router.get("/getOrders", getMyOrders);
router.get("/get/:orderId", fetchedSingleOrder);

router.patch("/update/:orderId", updateOrderStatus);

router.get("/:restaurantId", fetchedRestaurantOrders);

// router.get("/payment/:id", fetchOrderForPayment);


export default router