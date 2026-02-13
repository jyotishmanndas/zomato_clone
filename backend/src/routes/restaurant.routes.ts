import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import { addRestaurant } from "../controllers/restaurant.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("image"), addRestaurant);


export default router;