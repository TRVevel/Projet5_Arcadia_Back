import express from "express";
import { addGame, deleteGame, getAllGames } from "../controllers/staff/gameControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";

const router = express.Router();
router.get("/games", getAllGames);

// Staff routes
router.post("/erp/games", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addGame);
router.delete("/erp/games/:id", verifyTokenMiddleware, authorizeRoles("Storekeeper"), deleteGame);

export default router;