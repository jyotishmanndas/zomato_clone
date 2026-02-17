import { Router } from "express";
import { addToCartController, decrementCartController, getCartController, incrementCartController, removeCartController } from "../controllers/cart.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/addToCart", addToCartController);
router.post("/increment", incrementCartController);
router.post("/decrement", decrementCartController);
router.post("/remove/:itemId", removeCartController);

router.get("/getCart", getCartController);


export default router;