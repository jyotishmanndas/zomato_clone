import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import { addRestaurant, getMyRestaurant, getNearByRestaurant, updateRestaurant, updateRestaurantStatus } from "../controllers/restaurant.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("image"), addRestaurant);
router.patch("/status", updateRestaurantStatus);
router.patch("/update-details", updateRestaurant);
router.get("/my/restaurant", getMyRestaurant);
router.get("/all", getNearByRestaurant)


export default router;