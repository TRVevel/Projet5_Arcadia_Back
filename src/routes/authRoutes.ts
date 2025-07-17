import express from "express";
import { customerLogin, customerRegister, logout, staffLogin, staffRegister } from "../controllers/authControllers";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inscription d'un client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               adress:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - adress
 *               - password
 *     responses:
 *       201:
 *         description: Client créé
 *       400:
 *         description: Erreur de validation ou client existant
 */
router.post("/register", customerRegister);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Erreur de validation ou mot de passe incorrect
 */
router.post("/login", customerLogin);

/**
 * @swagger
 * /api/auth/erp/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inscription staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Staff créé
 *       400:
 *         description: Erreur de validation ou staff existant
 */
router.post("/erp/register", staffRegister);

/**
 * @swagger
 * /api/auth/erp/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Erreur de validation ou mot de passe incorrect
 */
router.post("/erp/login", staffLogin);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion (supprime le cookie JWT)
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', logout);

export default router;