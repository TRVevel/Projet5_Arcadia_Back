import express from "express";
import { createOrder, getAllOrders } from "../controllers/staff/orderControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
const router = express.Router();

router.get("/orders", verifyTokenMiddleware, authorizeRoles("Employee"), getAllOrders);
router.post("/orders", verifyTokenMiddleware, authorizeRoles("Employee"), createOrder);
export default router;