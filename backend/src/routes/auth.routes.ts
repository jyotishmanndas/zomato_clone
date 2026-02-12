import { Router } from "express";
import { addRole, loginController } from "../controllers/auth.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.patch("/add/role", verifyJWT, addRole);

export default router