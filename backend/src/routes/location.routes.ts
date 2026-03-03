import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { locationController } from "../controllers/location.controllers";

const router = Router();

router.use(verifyJWT);

router.get("/reverse", locationController)

export default router