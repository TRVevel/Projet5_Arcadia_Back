import express from "express";
import { getAllBaskets } from "../controllers/staff/basketControllers";
import { confirmBasket, createBasket, deleteBasket, getCustomerBaskets, modifyBasket } from "../controllers/customer/basketControllers";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
const router = express.Router();

/**
 * @swagger
 * /api/baskets:
 *   get:
 *     tags:
 *       - Customer Basket
 *     summary: Récupère les paniers du client connecté
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des paniers du client
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucun panier trouvé
 */
router.get("/baskets", verifyTokenMiddleware, authorizeRoles("Customer"), getCustomerBaskets);

/**
 * @swagger
 * /api/baskets:
 *   post:
 *     tags:
 *       - Customer Basket
 *     summary: Ajouter un panier pour le client connecté
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_platform_id:
 *                 type: integer
 *                 default: 1
 *               quantity:
 *                 type: integer
 *                 default: 1
 *             required:
 *               - game_platform_id
 *               - quantity
 *     responses:
 *       201:
 *         description: Panier ajouté
 *       400:
 *         description: Champs manquants ou panier déjà ajouté
 *       401:
 *         description: Non authentifié
 */
router.post("/baskets", verifyTokenMiddleware, authorizeRoles("Customer"), createBasket);

/**
 * @swagger
 * /api/baskets/{id}:
 *   put:
 *     tags:
 *       - Customer Basket
 *     summary: Modifier la quantité d'un panier
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 default: 2
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Panier modifié
 *       400:
 *         description: Quantité manquante
 *       404:
 *         description: Panier non trouvé
 */
router.put("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), modifyBasket);

/**
 * @swagger
 * /api/baskets/{id}:
 *   delete:
 *     tags:
 *       - Customer Basket
 *     summary: Supprimer un panier
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Panier supprimé
 *       404:
 *         description: Panier non trouvé
 */
router.delete("/baskets/:id", verifyTokenMiddleware, authorizeRoles("Customer"), deleteBasket);

/**
 * @swagger
 * /api/baskets/confirm:
 *   post:
 *     tags:
 *       - Customer Basket
 *     summary: Confirmer le panier et créer une commande
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               card_name:
 *                 type: string
 *                 default: Jean Dupont
 *               card_number:
 *                 type: string
 *                 default: "4111111111111111"
 *               card_expiry:
 *                 type: string
 *                 default: "01/10"
 *               card_cvc:
 *                 type: string
 *                 default: "123"
 *             required:
 *               - card_name
 *               - card_number
 *               - card_expiry
 *               - card_cvc
 *     responses:
 *       201:
 *         description: Commande confirmée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucun panier trouvé
 */
router.post("/baskets/confirm", verifyTokenMiddleware, authorizeRoles("Customer"), confirmBasket);

/**
 * @swagger
 * /api/erp/baskets:
 *   get:
 *     tags:
 *       - Staff Basket
 *     summary: Récupérer tous les paniers (staff)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les paniers
 *       401:
 *         description: Non authentifié
 */
router.get("/erp/baskets", verifyTokenMiddleware, authorizeRoles("Employee"), getAllBaskets);

export default router;