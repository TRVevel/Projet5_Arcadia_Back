import express from "express";
import { getAllGamesPlatforms, getGamePlatformDetails } from "../controllers/game_platformsController";
import { addGamePlatform, GamePlatformNoMore } from "../controllers/staff/game_platformsController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";
const router = express.Router();

/**
 * @swagger
 * /api/gameplatforms:
 *   get:
 *     tags:
 *       - GamePlatform
 *     summary: Récupérer toutes les relations game_platforms
 *     responses:
 *       200:
 *         description: Liste des relations game_platforms
 *       500:
 *         description: Erreur lors de la récupération des games
 */
router.get("/gameplatforms", getAllGamesPlatforms);

/**
 * @swagger
 * /api/gameplatforms/{id}:
 *   get:
 *     tags:
 *       - GamePlatform
 *     summary: Détail d'une relation game_platform (avec jeu et plateforme associés)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Détail de la relation game_platform
 *       400:
 *         description: Paramètre 'id' manquant ou invalide
 *       404:
 *         description: GamePlatform, Jeu ou Plateforme introuvable
 *       500:
 *         description: Erreur lors de la récupération des détails du GamePlatform
 */
router.get("/gameplatforms/:id", getGamePlatformDetails);

/**
 * @swagger
 * /api/erp/gameplatforms:
 *   post:
 *     tags:
 *       - GamePlatform Staff
 *     summary: Ajouter une nouvelle relation game_platform (staff uniquement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_id:
 *                 type: integer
 *                 default: 1
 *               platform_id:
 *                 type: integer
 *                 default: 1
 *               compatible_device:
 *                 type: string
 *                 default: "Xbox Series X"
 *               release_date:
 *                 type: string
 *                 format: date
 *                 default: "2024-11-01"
 *               price:
 *                 type: number
 *                 default: 69.99
 *               image:
 *                 type: string
 *                 default: "https://cdn.example.com/image.jpg"
 *               stock:
 *                 type: integer
 *                 default: 10
 *             required:
 *               - game_id
 *               - platform_id
 *               - compatible_device
 *               - release_date
 *               - price
 *               - image
 *               - stock
 *     responses:
 *       201:
 *         description: Ajout de la platform au game
 *       400:
 *         description: Champs manquants ou platform déjà inscrite dans ce game
 *       500:
 *         description: Erreur lors de l'ajout de la platform au game
 */
router.post("/erp/gameplatforms/", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addGamePlatform);

/**
 * @swagger
 * /api/erp/gameplatforms/{id}:
 *   put:
 *     tags:
 *       - GamePlatform Staff
 *     summary: Désactiver une relation game_platform (retrait de la vente, staff uniquement)
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
 *         description: La relation game_platform a été retirée de la vente avec succès
 *       400:
 *         description: ID manquant ou relation déjà retirée de la vente
 *       404:
 *         description: Relation game_platform non trouvée
 *       500:
 *         description: Erreur lors du retrait de vente de la relation game_platform
 */
router.put("/erp/gameplatforms/:id", verifyTokenMiddleware, authorizeRoles("Storekeeper"), GamePlatformNoMore);

export default router;