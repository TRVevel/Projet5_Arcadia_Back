import express from "express";
import { addDeviceFromPlatform, addPlatform, getAllPlatform, modifyPlatform, removeDeviceFromPlatform } from "../controllers/staff/platformControllers";

const router = express.Router();
router.get("/platforms", getAllPlatform);
router.post("/platforms", addPlatform);
router.put("/platforms/:id", modifyPlatform);
router.put("/platforms/:id/devices/add", addDeviceFromPlatform);
router.put("/platforms/:id/devices/remove", removeDeviceFromPlatform);
export default router;