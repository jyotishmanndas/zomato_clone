import { Router } from "express";
import { addRole, loginController } from "../controllers/auth.controllers";

const router = Router();

router.post("/login", loginController);
router.patch("/add/role", addRole);

export default router