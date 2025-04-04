import express from "express";
import { addDeviceFromPlatform, addPlatform, getAllPlatform, modifyPlatform, removeDeviceFromPlatform } from "../controllers/staff/platformControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";

const router = express.Router();
router.get("/erp/platforms", getAllPlatform);
router.post("/erp/platforms", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addPlatform);
router.put("/erp/platforms/:id", verifyTokenMiddleware, authorizeRoles("Storekeeper"), modifyPlatform);
router.put("/erp/platforms/:id/devices/add", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addDeviceFromPlatform);
router.put("/erp/platforms/:id/devices/remove", verifyTokenMiddleware, authorizeRoles("Storekeeper"), removeDeviceFromPlatform);
export default router;