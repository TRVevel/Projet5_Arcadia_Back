import express from "express";
import { addGame, deleteGame, getAllGames } from "../controllers/staff/gameControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { authorizeRoles } from "../middlewares/whatRoleMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags:
 *       - Game
 *     summary: Récupérer tous les jeux
 *     responses:
 *       200:
 *         description: Liste des jeux
 *       500:
 *         description: Erreur lors de la récupération des games
 */
router.get("/games", getAllGames);

/**
 * @swagger
 * /api/erp/games:
 *   post:
 *     tags:
 *       - Game Staff
 *     summary: Ajouter un jeu (staff uniquement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 default: "Eclipse of Souls"
 *               description:
 *                 type: string
 *                 default: "A dark fantasy RPG journey through cursed lands."
 *               developer:
 *                 type: string
 *                 default: "Arcadia Studios"
 *               publisher:
 *                 type: string
 *                 default: "Arcadia Publishing"
 *               genre:
 *                 type: string
 *                 default: "RPG"
 *               sub_genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: ["Fantasy", "Adventure"]
 *               pegi:
 *                 type: integer
 *                 default: 16
 *               sensitive_content:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Violence, Sexual Content, Drugs, Gambling, Bad Language]
 *                 default: ["Violence"]
 *             required:
 *               - title
 *               - description
 *               - developer
 *               - publisher
 *               - genre
 *               - sub_genres
 *               - pegi
 *     responses:
 *       201:
 *         description: Ajout du game avec succès
 *       400:
 *         description: Données invalides ou game déjà ajouté
 *       500:
 *         description: Erreur lors de l'ajout du game
 */
router.post("/erp/games", verifyTokenMiddleware, authorizeRoles("Storekeeper"), addGame);

/**
 * @swagger
 * /api/erp/games/{id}:
 *   delete:
 *     tags:
 *       - Game Staff
 *     summary: Supprimer un jeu (staff uniquement)
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
 *         description: Game supprimé avec succès
 *       400:
 *         description: L'ID est requis, game en vente, présent dans des paniers ou commandes
 *       404:
 *         description: Game introuvable
 *       500:
 *         description: Erreur serveur lors de la suppression du jeu
 */
router.delete("/erp/games/:id", verifyTokenMiddleware, authorizeRoles("Storekeeper"), deleteGame);

export default router;