import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/payment.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

export default router;

