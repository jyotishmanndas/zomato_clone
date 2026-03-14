import { Router } from "express";
import { getPendingRestaurant, getPendingRiders, verifyRestaurant, verifyRider } from "../controllers/admin.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/restaurant/pending", getPendingRestaurant);
router.get("/rider/pending", getPendingRiders)

router.patch("/verify/restaurant/:id", verifyRestaurant);
router.patch("/verify/rider/:id", verifyRider);


export default router