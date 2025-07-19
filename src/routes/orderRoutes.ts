import express from "express";
import { createOrder, getAllOrders, listOrdersByCustomer, modifyOrderStatus } from "../controllers/staff/orderControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
import { cancelMyOrder, getCustomerOrders } from "../controllers/customer/orderController";
const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Customer Order
 *     summary: Récupère toutes les commandes du client connecté
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du client
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucune commande trouvée
 */
router.get("/orders", verifyTokenMiddleware, authorizeRoles("Customer"), getCustomerOrders);

/**
 * @swagger
 * /api/orders/{order_id}:
 *   delete:
 *     tags:
 *       - Customer Order
 *     summary: Annule une commande du client connecté (si elle est en attente)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: order_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande annulée avec succès
 *       400:
 *         description: Impossible d'annuler cette commande
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Commande introuvable ou n'appartient pas à ce client
 */
router.delete("/orders/:order_id", verifyTokenMiddleware, authorizeRoles("Customer"), cancelMyOrder);

// Staff routes

/**
 * @swagger
 * /api/erp/orders:
 *   get:
 *     tags:
 *       - Staff Order
 *     summary: Récupère toutes les commandes (staff)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les commandes
 *       401:
 *         description: Non authentifié
 */
router.get("/erp/orders", verifyTokenMiddleware, authorizeRoles("Employee"), getAllOrders);

/**
 * @swagger
 * /api/erp/orders/{id}:
 *   get:
 *     tags:
 *       - Staff Order
 *     summary: Récupère les commandes d'un client spécifique (staff)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes du client
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Client ou commandes non trouvés
 */
router.get("/erp/orders/:id", verifyTokenMiddleware, authorizeRoles("Employee"), listOrdersByCustomer);

/**
 * @swagger
 * /api/erp/orders:
 *   post:
 *     tags:
 *       - Staff Order
 *     summary: Crée une nouvelle commande (staff)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     game_platform_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *             required:
 *               - customer_id
 *               - items
 *     responses:
 *       201:
 *         description: Commande créée
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/erp/orders", verifyTokenMiddleware, authorizeRoles("Employee"), createOrder);

/**
 * @swagger
 * /api/erp/orders/{id}:
 *   put:
 *     tags:
 *       - Staff Order
 *     summary: Modifie le statut d'une commande (staff)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statut de la commande modifié
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Commande non trouvée
 */
router.put("/erp/orders/:id", verifyTokenMiddleware, authorizeRoles("Employee"), modifyOrderStatus); // Assuming you want to update the order with the same function
export default router;