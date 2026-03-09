import { Router } from "express";
import { addRole, loginController, logoutController, userprofileController } from "../controllers/auth.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.patch("/add/role", verifyJWT, addRole);

router.get("/user/profile", verifyJWT, userprofileController);

router.post("/user/logout", verifyJWT, logoutController);

export default router