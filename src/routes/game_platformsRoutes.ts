import express from "express";
import {addGamePlatform, getAllGamesPlatforms} from "../controllers/game_platformsController";

const router = express.Router();

router.get("/gameplatforms", getAllGamesPlatforms);
router.post("/gameplatforms", addGamePlatform);
export default router;