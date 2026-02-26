import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { addMenuItem, deleteMenuItem, getItmesByRestaurant, getMenuByRestauarant, toogleMenuItemAvailability, updateMenuItem } from "../controllers/menu.controllers";
import { upload } from "../middleware/multer.middleware";


const router = Router();

router.use(verifyJWT);

router.post("/add/:restaurantId", upload.single("menuImg"), addMenuItem);
router.get("/my-items", getItmesByRestaurant);
router.patch("/update/:itemId", updateMenuItem);
router.patch("/status/:itemId", toogleMenuItemAvailability)
router.delete("/delete/:itemId", deleteMenuItem);

router.get("/items/:restaurantId", getMenuByRestauarant)


export default router;