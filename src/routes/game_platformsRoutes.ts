import express from "express";
import { addDeviceFromGamePlatform, addGamePlatform, getAllGamesPlatforms, removeDeviceFromGamePlatform } from "../controllers/game_platformsController";

const router = express.Router();

router.get("/gameplatforms", getAllGamesPlatforms);
router.post("/gameplatforms", addGamePlatform);
router.put("/gameplatforms/:id/devices/add", addDeviceFromGamePlatform);
router.put("/gameplatforms/:id/devices/remove", removeDeviceFromGamePlatform);
export default router;