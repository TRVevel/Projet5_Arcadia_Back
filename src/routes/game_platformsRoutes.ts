import express from "express";
import {addGamePlatform, GamePlatformNoMore, getAllGamesPlatforms} from "../controllers/staff/game_platformsController";

const router = express.Router();

router.get("/gameplatforms", getAllGamesPlatforms);
router.post("/gameplatforms", addGamePlatform);
router.put("/gameplatforms/:id", GamePlatformNoMore);
export default router;