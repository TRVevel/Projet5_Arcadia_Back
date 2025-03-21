import express from "express";
import { addPlatform, getAllPlatform } from "../controllers/platformControllers";

const router = express.Router();
router.get("/platforms", getAllPlatform);
router.post("/platforms", addPlatform);

export default router;