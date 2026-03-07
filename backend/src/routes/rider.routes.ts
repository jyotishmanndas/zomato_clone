import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { addRiderProfile, getRiderProfile, toogleRiderAvailability } from "../controllers/rider.controllers";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("riderprofile"), addRiderProfile);
router.get("/profile", getRiderProfile);
router.patch("/toggle", toogleRiderAvailability);


export default router;