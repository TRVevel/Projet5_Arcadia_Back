import express from "express";
import { getAllPlatform } from "../controllers/platformControllers";

const router = express.Router();
router.get("/platforms", getAllPlatform);

export default router;