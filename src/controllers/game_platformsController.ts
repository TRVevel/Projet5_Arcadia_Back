import { Request, Response } from "express";
import GamePlatform from "../models/game_platforms.model";
import Game from "../models/game.model";
import Platform from "../models/platform.model";

// Récupérer toutes les relations game_platforms
export async function getAllGamesPlatforms(req: Request, res: Response) {
    try {
        const gamesPlatforms = await GamePlatform.findAll();
        res.status(200).json(gamesPlatforms);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur lors de la récupération des games' });
    }
}

// Détail d'une relation game_platform (avec jeu et plateforme associés)
export async function getGamePlatformDetails(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: "Paramètre 'id' manquant ou invalide" });
        return;
    }

    try {
        const gamePlatform = await GamePlatform.findOne({
            where: { id: Number(id) },
            attributes: ['game_id', 'platform_id', 'compatible_device', 'release_date', 'price', 'image', 'stock', 'status']
        });

        if (!gamePlatform) {
            res.status(404).json({ message: "GamePlatform introuvable" });
            return;
        }

        const game_id = gamePlatform.getDataValue('game_id');
        const platform_id = gamePlatform.getDataValue('platform_id');

        const game = await Game.findOne({
            where: { id: game_id },
            attributes: ['id', 'title', 'description', 'developer', 'publisher', 'genre', 'sub_genres', 'pegi', 'sensitive_content', 'status']
        });

        const platform = await Platform.findOne({
            where: { id: platform_id },
            attributes: ['id', 'name']
        });

        if (!game || !platform) {
            res.status(404).json({ message: "Jeu ou Plateforme introuvable" });
            return;
        }

        res.status(200).json({
            game_platform: gamePlatform,
            game,
            platform
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Erreur lors de la récupération des détails du GamePlatform",
            error: error.message
        });
    }
}