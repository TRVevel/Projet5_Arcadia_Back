import { Request, Response } from "express";
import GamePlatform from "../../models/game_platforms.model";
import Game from "../../models/game.model";
import Platform from "../../models/platform.model";

export async function getAllGamesPlatforms(req: Request, res: Response) {
    try {
        const gamesPlatforms = await GamePlatform.findAll();
        res.status(200).json(gamesPlatforms);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des games : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des games' })
        
    }
}


export async function getGamePlatformDetails(req: Request, res: Response) {
    const { id } = req.params; // ID du game_platform à récupérer

    try {
        // Récupérer la game_platform en utilisant l'ID
        const gamePlatform = await GamePlatform.findOne({
            where: { id },
            attributes: ['game_id', 'platform_id', 'compatible_device']  // On récupère uniquement les IDs du jeu et de la plateforme
        });

        // Vérifier si la game_platform existe
        if (!gamePlatform) {
            res.status(404).json({ message: "GamePlatform introuvable" });
            return;
        }

        const { game_id, platform_id } = gamePlatform;

        // Rechercher les détails du jeu à partir du game_id
        const game = await Game.findOne({
            where: { id: game_id },
            attributes: ['id', 'title', 'description', 'developer', 'publisher', 'genre', 'sub_genres', 'pegi', 'sensitive_content', 'status']
        });

        // Rechercher les détails de la plateforme à partir du platform_id
        const platform = await Platform.findOne({
            where: { id: platform_id },
            attributes: ['id', 'name']
        });

        // Vérifier si le jeu ou la plateforme n'ont pas été trouvés
        if (!game || !platform) {
            res.status(404).json({ message: "Jeu ou Plateforme introuvable" });
            return;
        }

        // Répondre avec les informations du jeu, de la plateforme et de la game_platform
       res.status(200).json({
            game_platform: gamePlatform,
            game: game,  // Détails du jeu
            platform: platform  // Détails de la plateforme
        });
        return;

    } catch (error: any) {
        console.error("Erreur lors de la récupération des détails du GamePlatform : ", error);
        res.status(500).json({ message: "Erreur lors de la récupération des détails du GamePlatform" });
    }
}


export async function addGamePlatform(req: Request, res: Response) {
    const {game_id, platform_id, compatible_device, release_date, price, stock  } = await req.body;
    try{
        if (!game_id || !platform_id || !compatible_device|| compatible_device.length === 0 || !release_date || !price || !stock) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const newGamePlatorm = await GamePlatform.create({
            game_id,
            platform_id,
            compatible_device,
            release_date, // Stocke les données binaires directement
            price,
            stock
        });
        res.status(201).json({message:'Ajout de la platform au game:', data: newGamePlatorm});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Cette platform est déjà inscrite dans ce game!'});
            return 
        }
        console.error("Erreur lors de l'ajout de la platform au game : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout de la platform au game "});
    }
}

export async function GamePlatformNoMore(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        if (!id) {
            res.status(400).json({ message: "Vous devez fournir un ID de relation game_platform" });
            return;
        }

        // Récupérer la relation game_platform par son ID
        const gamePlatform = await GamePlatform.findByPk(id);
        if (!gamePlatform) {
            res.status(404).json({ message: "Relation game_platform non trouvée" });
            return;
        }

        if (gamePlatform.status === false) {
            res.status(400).json({ message: "Cette relation game_platform est déjà retirée de la vente" });
            return;
        }

        // Désactiver la relation game_platform
        gamePlatform.status = false;
        await gamePlatform.save();

        // Vérifier si toutes les autres plateformes du même jeu sont désactivées
        const remainingPlatforms = await GamePlatform.findAll({
            where: { game_id: gamePlatform.game_id },
            attributes: ["status"],
            raw: true,
        });

        // Vérifier si toutes les plateformes du jeu sont désactivées
        if (remainingPlatforms.every(platform => platform.status === false)) {
            await Game.update({ status: false }, { where: { id: gamePlatform.game_id } });
        }

        res.status(200).json({ message: "La relation game_platform a été retirée de la vente avec succès" });
        return;

    } catch (error: any) {
        console.error("Erreur lors du retrait de vente de la relation game_platform :", error);
        res.status(500).json({ message: "Erreur lors du retrait de vente de la relation game_platform" });
        return;
    }
}