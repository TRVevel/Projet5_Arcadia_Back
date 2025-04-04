import express from "express";
import { getAllBaskets} from "../controllers/staff/basketControllers";
import { confirmBasket, createBasket, deleteBasket, getCustomerBaskets, modifyBasket } from "../controllers/customer/basketControllers";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
const router = express.Router();

// Customer routes
router.get("/baskets", verifyTokenMiddleware, authorizeRoles("Customer"), getCustomerBaskets);
router.post("/baskets", verifyTokenMiddleware, authorizeRoles("Customer"), createBasket);
router.put("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), modifyBasket);
router.delete("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), deleteBasket);
router.post("/baskets/confirm",verifyTokenMiddleware, authorizeRoles("Customer"),  confirmBasket);

// Staff routes
router.get("/erp/baskets",verifyTokenMiddleware, authorizeRoles("Employee"), getAllBaskets);
export default router;