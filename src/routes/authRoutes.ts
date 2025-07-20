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
 *                 default: Jean
 *               last_name:
 *                 type: string
 *                 default: Dupont
 *               email:
 *                 type: string
 *                 default: jean.dupont@email.com
 *               adress:
 *                 type: string
 *                 default: 10 rue de Paris, 75000 Paris
 *               password:
 *                 type: string
 *                 default: Password123!
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
 *                 default: jean.dupont@email.com
 *               password:
 *                 type: string
 *                 default: Password123!
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
 *                 default: Alice
 *               last_name:
 *                 type: string
 *                 default: Martin
 *               email:
 *                 type: string
 *                 default: alice.martin@arcadia.com
 *               password:
 *                 type: string
 *                 default: StaffPass123!
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
 *                 default: alice.martin@arcadia.com
 *               password:
 *                 type: string
 *                 default: StaffPass123!
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