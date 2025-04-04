import express from "express";
import {addGamePlatform, GamePlatformNoMore, getAllGamesPlatforms, getGamePlatformDetails} from "../controllers/staff/game_platformsController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";

const router = express.Router();
router.get("/gameplatforms", getAllGamesPlatforms);
router.get("/gameplatforms/:id", getGamePlatformDetails);
// Staff routes
router.post("erp/gameplatforms/", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addGamePlatform);
router.put("erp/gameplatforms/:id",verifyTokenMiddleware, authorizeRoles("Storekeeper"), GamePlatformNoMore);

export default router;