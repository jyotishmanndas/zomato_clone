import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import { addRestaurant, getMyRestaurant, getNearByRestaurant, getSingleRestaurant, updateRestaurant, updateRestaurantStatus } from "../controllers/restaurant.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("image"), addRestaurant);
router.patch("/status/:restaurantId", updateRestaurantStatus);
router.patch("/update-details/:restaurantId", updateRestaurant);
router.get("/my/restaurant", getMyRestaurant);
router.get("/all", getNearByRestaurant);

router.get("/:id", getSingleRestaurant);


export default router;