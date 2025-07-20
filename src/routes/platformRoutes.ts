import express from "express";
import { addDeviceFromPlatform, addPlatform, getAllPlatform, modifyPlatform, removeDeviceFromPlatform } from "../controllers/staff/platformControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/erp/platforms:
 *   get:
 *     tags:
 *       - Platform
 *     summary: Récupérer toutes les plateformes
 *     responses:
 *       200:
 *         description: Liste des plateformes
 *       500:
 *         description: Erreur lors de la récupération des platforms
 */
router.get("/erp/platforms", getAllPlatform);

/**
 * @swagger
 * /api/erp/platforms:
 *   post:
 *     tags:
 *       - Platform
 *     summary: Ajouter une plateforme (staff uniquement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "PlayStation 5"
 *               devices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: ["DualSense", "PSVR2"]
 *             required:
 *               - name
 *               - devices
 *     responses:
 *       201:
 *         description: Ajout de la platform
 *       400:
 *         description: Tous les champs sont requis ou platform déjà inscrite
 *       500:
 *         description: Erreur lors de l'ajout de la platform
 */
router.post("/erp/platforms", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addPlatform);

/**
 * @swagger
 * /api/erp/platforms/{id}:
 *   put:
 *     tags:
 *       - Platform
 *     summary: Modifier une plateforme (staff uniquement)
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
 *               name:
 *                 type: string
 *                 default: "PlayStation 5 Pro"
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Platform modifiée avec succès
 *       400:
 *         description: Vous devez taper un nom de platform
 *       404:
 *         description: Platform non trouvée
 *       500:
 *         description: Erreur lors de la modification de la platform
 */
router.put("/erp/platforms/:id", verifyTokenMiddleware, authorizeRoles("Storekeeper"), modifyPlatform);

/**
 * @swagger
 * /api/erp/platforms/{id}/devices/add:
 *   put:
 *     tags:
 *       - Platform
 *     summary: Ajouter un device à une plateforme (staff uniquement)
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
 *               devices:
 *                 type: string
 *                 default: "PSVR2"
 *             required:
 *               - devices
 *     responses:
 *       200:
 *         description: Device ajouté avec succès
 *       400:
 *         description: Le device à ajouter est requis
 *       404:
 *         description: Platform non trouvée
 *       500:
 *         description: Erreur lors de l'ajout du device à la platform
 */
router.put("/erp/platforms/:id/devices/add", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addDeviceFromPlatform);

/**
 * @swagger
 * /api/erp/platforms/{id}/devices/remove:
 *   put:
 *     tags:
 *       - Platform
 *     summary: Retirer un device d'une plateforme (staff uniquement)
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
 *               device:
 *                 type: string
 *                 default: "PSVR2"
 *             required:
 *               - device
 *     responses:
 *       200:
 *         description: Device retiré avec succès
 *       400:
 *         description: Le device à retirer est requis
 *       404:
 *         description: Platform non trouvée
 *       500:
 *         description: Erreur lors de la suppression du device de la platform
 */
router.put("/erp/platforms/:id/devices/remove", verifyTokenMiddleware, authorizeRoles("Storekeeper"), removeDeviceFromPlatform);

export default router;