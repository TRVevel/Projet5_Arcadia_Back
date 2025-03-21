import express from "express";
import { customerLogin, customerRegister, userLogin, userRegister } from "../controllers/authControllers";


const router = express.Router();
router.post("/register", customerRegister);
router.post("/login", customerLogin);
router.post("/erp/register", userRegister);
router.post("/erp/login", userLogin);
export default router;