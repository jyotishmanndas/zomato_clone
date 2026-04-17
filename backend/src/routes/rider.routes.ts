import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { accepOrder, addRiderProfile, getRiderProfile, getRiderStats, toogleRiderAvailability } from "../controllers/rider.controllers";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/create", upload.single("riderprofile"), addRiderProfile);
router.get("/profile", getRiderProfile);
router.get("/stats", getRiderStats);
router.patch("/toggle", toogleRiderAvailability);

router.put("/accept/:orderId", accepOrder);


export default router;