import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import GamePlatform from "../../models/game_platforms.model";
import Game from "../../models/game.model";

// Ajouter une nouvelle relation game_platform
export async function addGamePlatform(req: Request, res: Response) {
    const { game_id, platform_id, compatible_device, release_date, price, image, stock } = req.body;

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
        const uploadResult = await cloudinary.uploader.upload(image, {
            folder: "game_platforms",
            public_id: `${game_id}_${platform_id}_${Date.now()}`
        });

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

        res.status(201).json({ message: 'Ajout de la platform au game', data: newGamePlatform });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Cette platform est déjà inscrite dans ce game!' });
            return;
        }
        res.status(500).json({ message: "Erreur lors de l'ajout de la platform au game", error: error.message });
    }
}

// Désactiver une relation game_platform (retrait de la vente)
export async function GamePlatformNoMore(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "Vous devez fournir un ID de relation game_platform" });
        return;
    }

    try {
        const gamePlatform = await GamePlatform.findByPk(id);
        if (!gamePlatform) {
            res.status(404).json({ message: "Relation game_platform non trouvée" });
            return;
        }

        if (gamePlatform.status === false) {
            res.status(400).json({ message: "Cette relation game_platform est déjà retirée de la vente" });
            return;
        }

        gamePlatform.status = false;
        await gamePlatform.save();

        const remainingPlatforms = await GamePlatform.findAll({
            where: { game_id: gamePlatform.game_id },
            attributes: ["status"],
            raw: true,
        });

        if (remainingPlatforms.every(platform => platform.status === false)) {
            await Game.update({ status: false }, { where: { id: gamePlatform.game_id } });
        }

        res.status(200).json({ message: "La relation game_platform a été retirée de la vente avec succès" });
    } catch (error: any) {
        res.status(500).json({ message: "Erreur lors du retrait de vente de la relation game_platform" });
    }
}