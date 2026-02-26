import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { addAddress, deleteAddress, getAddress } from "../controllers/address.controllers";

const router = Router();

router.use(verifyJWT);

router.post("/create", addAddress);
router.delete("/delete/:addressId", deleteAddress);
router.get("/getAddress", getAddress);


export default router;