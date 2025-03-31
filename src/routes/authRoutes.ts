import express from "express";
import { customerLogin, customerRegister, staffLogin,staffRegister } from "../controllers/authControllers";

const router = express.Router();
router.post("/register", customerRegister);
router.post("/login", customerLogin);
router.post("/erp/register", staffRegister);
router.post("/erp/login", staffLogin);
export default router;