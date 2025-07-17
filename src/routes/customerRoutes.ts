import express from "express";
import { updateCustomerAccount, getCustomerProfil } from "../controllers/customer/customerControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
const router = express.Router();

/**
 * @swagger
 * /api/customer/profil:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Récupère le profil du client connecté (via le token)
 *     responses:
 *       200:
 *         description: Profil client récupéré
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Client non trouvé
 */
router.get("/customer/profil", verifyTokenMiddleware, getCustomerProfil);

/**
 * @swagger
 * /api/customer/account:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Met à jour le numéro de téléphone, l'adresse et la date de naissance du client (mot de passe requis)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "0612345678"
 *               adress:
 *                 type: string
 *                 example: "12 rue de Paris, 75000 Paris"
 *               birthdate:
 *                 type: string
 *                 example: "1990-01-01"
 *               password:
 *                 type: string
 *                 example: "monMotDePasse"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Compte client mis à jour
 *       400:
 *         description: Erreur de validation ou champs manquants
 *       401:
 *         description: Mot de passe incorrect ou authentification requise
 *       404:
 *         description: Client non trouvé
 */
router.put("/customer/account",verifyTokenMiddleware, updateCustomerAccount);



export default router;