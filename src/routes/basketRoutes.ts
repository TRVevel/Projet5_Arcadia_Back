import express from "express";
import { getAllBaskets} from "../controllers/staff/basketControllers";
import { confirmBasket, createBasket, deleteBasket, modifyBasket } from "../controllers/customer/basketControllers";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
const router = express.Router();

router.get("/baskets",verifyTokenMiddleware, authorizeRoles("Employee"), getAllBaskets);
router.post("/baskets", verifyTokenMiddleware, authorizeRoles("Customer"), createBasket);
router.put("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), modifyBasket);
router.delete("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), deleteBasket);
router.post("/baskets/confirm",verifyTokenMiddleware, authorizeRoles("Customer"),  confirmBasket);
export default router;