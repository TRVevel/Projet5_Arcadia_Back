import express from "express";
import { addGame, getAllGames } from "../controllers/staff/gameControllers";

const router = express.Router();
router.get("/games", getAllGames);
router.post("/games", addGame);

export default router;