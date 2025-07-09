import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
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
    const { id } = req.params;
    console.log("Valeur reçue pour id :", id, "Type :", typeof id);

    if (!id || isNaN(Number(id))) {
        console.log("ID invalide détecté :", id);
        res.status(400).json({ message: "Paramètre 'id' manquant ou invalide" });
        return;
    }

    try {
        const gamePlatform = await GamePlatform.findOne({
            where: { id: Number(id) },
            attributes: ['game_id', 'platform_id', 'compatible_device']
        });
console.log("Recherche gamePlatform id:", id);
// Après chaque findOne :
if (!gamePlatform) console.log("gamePlatform non trouvé");
        // Vérifier si la game_platform existe
        if (!gamePlatform) {
            res.status(404).json({ message: "GamePlatform introuvable" });
            return;
        }

        const game_id = gamePlatform.getDataValue('game_id');
        const platform_id = gamePlatform.getDataValue('platform_id');

        // Rechercher les détails du jeu à partir du game_id
        const game = await Game.findOne({
            where: { id: game_id },
            attributes: ['id', 'title', 'description', 'developer', 'publisher', 'genre', 'sub_genres', 'pegi', 'sensitive_content', 'status']
        });
        console.log("2Recherche gamePlatform id:", id);
// Après chaque findOne :
if (!gamePlatform) console.log("2gamePlatform non trouvé");
if (!game) console.log("2game non trouvé pour game_id:", game_id);
        // Rechercher les détails de la plateforme à partir du platform_id
        const platform = await Platform.findOne({
            where: { id: platform_id },
            attributes: ['id', 'name']
        });
        console.log("3Recherche gamePlatform id:", id);
// Après chaque findOne :
if (!gamePlatform) console.log("3gamePlatform non trouvé");
if (!game) console.log("3game non trouvé pour game_id:", game_id);
if (!platform) console.log("3platform non trouvée pour platform_id:", platform_id);
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
        console.error("Erreur lors de la récupération des détails du GamePlatform :", error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des détails du GamePlatform",
            error: error.message, // Ajoute ce détail pour voir l'erreur réelle côté client
            stack: error.stack    // (optionnel) pour le debug
        });
    }
}


export async function addGamePlatform(req: Request, res: Response) {
    const { game_id, platform_id, compatible_device, release_date, price, image, stock } = req.body;

    // Vérification détaillée des champs manquants
    const missingFields: string[] = [];
    if (!game_id) missingFields.push("game_id");
    if (!platform_id) missingFields.push("platform_id");
    if (!compatible_device || compatible_device.length === 0) missingFields.push("compatible_device");
    if (!release_date) missingFields.push("release_date");
    if (!price) missingFields.push("price");
    if (!image) missingFields.push("image");
    if (!stock) missingFields.push("stock");

    if (missingFields.length > 0) {
        res.status(400).json({ message: `Champs manquants : ${missingFields.join(", ")}` });
        return;
    }

    try {
        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image, {
            folder: "game_platforms",
            public_id: `${game_id}_${platform_id}_${Date.now()}`
        });

        // Utilise l'URL sécurisée de Cloudinary pour stocker dans la BDD
        const imageUrl = uploadResult.secure_url;

        const newGamePlatform = await GamePlatform.create({
            game_id,
            platform_id,
            compatible_device,
            release_date,
            price,
            image: imageUrl,
            stock
        });

        res.status(201).json({ message: 'Ajout de la platform au game:', data: newGamePlatform });

    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Cette platform est déjà inscrite dans ce game!' });
            return;
        }
        console.error("Erreur lors de l'ajout de la platform au game : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout de la platform au game ", error: error.message });
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