import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import { addRestaurant, getMyRestaurant, updateRestaurant, updateRestaurantStatus } from "../controllers/restaurant.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("image"), addRestaurant);
router.patch("/status", updateRestaurantStatus);
router.patch("/update-details", updateRestaurant);
router.get("/my/restaurant", getMyRestaurant);


export default router;