import { Router } from "express";
import { addRole, loginController, userprofileController } from "../controllers/auth.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.patch("/add/role", verifyJWT, addRole);

router.get("/user/profile", verifyJWT, userprofileController)

export default router