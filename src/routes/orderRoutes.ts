import express from "express";
import { createOrder, getAllOrders, listOrdersByCustomer, modifyOrderStatus } from "../controllers/staff/orderControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
import { cancelMyOrder, getCustomerOrders } from "../controllers/customer/orderController";
const router = express.Router();

router.get("/orders", verifyTokenMiddleware, authorizeRoles("Customer"), getCustomerOrders);
router.delete("orders/:id", verifyTokenMiddleware, authorizeRoles("Customer"), cancelMyOrder);

// Staff routes
router.get("/erp/orders", verifyTokenMiddleware, authorizeRoles("Employee"), getAllOrders);
router.get("/erp/orders/:id", verifyTokenMiddleware, authorizeRoles("Employee"), listOrdersByCustomer);
router.post("/erp/orders", verifyTokenMiddleware, authorizeRoles("Employee"), createOrder);
router.put("/erp/orders/:id", verifyTokenMiddleware, authorizeRoles("Employee"), modifyOrderStatus); // Assuming you want to update the order with the same function
export default router;