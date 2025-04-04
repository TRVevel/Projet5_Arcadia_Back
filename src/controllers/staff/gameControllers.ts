import { Request, Response } from "express";
import { validateSchema } from "../../utils/joiUtils";
import Game from "../../models/game.model";
import { gameSchema } from "../../JoiValidators/gamesValidators";
import GamePlatform from "../../models/game_platforms.model";
import Basket from "../../models/basket.model"; // Si tu as un modèle Basket
import OrderGamePlatform from "../../models/order_game_platform.model"; // Association Order/GamePlatform
import { Op } from "sequelize";
export async function getAllGames(req: Request, res: Response) {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des games : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des games' })
        
    }
}

export async function addGame(req: Request, res: Response) {
    const { title, description, developer, publisher, genre, sub_genres, pegi, sensitive_content } = validateSchema(req.body, gameSchema);
    try {
        // Vérification des champs requis
        if (!title || !description || !developer || !publisher || !genre || !sub_genres || !pegi || !sensitive_content) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }

        // Validation des données avec Joi ou toute autre validation
        const { error } = gameSchema.validate(req.body);
        if (error) {
            console.error("Validation échouée :", error.details);
            res.status(400).json({ message: "Données invalides", error: error.details });
            return;
        } else {
            console.log("Validation réussie !");
        }

        // Création du nouveau jeu
        const newGame = await Game.create({
            title,
            description,
            developer,
            publisher,
            genre,
            sub_genres,
            pegi,
            sensitive_content,
        });

        res.status(201).json({ message: 'Ajout du game avec succès', data: newGame });
        return;
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Ce game est déjà ajouté!' });
            return;
        }
        console.error("Erreur lors de l'ajout du game :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout du game" });
        return;
    }
}


export async function deleteGame(req: Request, res: Response) {
    const { id } = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: "L'ID est requis" });
            return;
        }

        const game = await Game.findByPk(id);

        if (!game) {
            res.status(404).json({ message: "Game introuvable" });
            return;
        }

        if (game.status === true) {
            res.status(400).json({ message: "Le Game ne peut pas être supprimé car il est encore en vente" });
            return;
        }

        // 🔍 Récupère toutes les relations game_platform du jeu
        const gamePlatforms = await GamePlatform.findAll({ where: { game_id: id } });
        const gamePlatformIds = gamePlatforms.map(gp => gp.id);

        // Vérifie la présence dans les paniers
        const basketCheck = await Basket.findOne({
            where: {
                game_platform_id: { [Op.in]: gamePlatformIds }
            }
        });

        if (basketCheck) {
            res.status(400).json({ message: "Le Game est encore présent dans des paniers, suppression impossible" });
            return;
        }

        // Vérifie la présence dans des commandes
        const orderCheck = await OrderGamePlatform.findOne({
            where: {
                game_platform_id: { [Op.in]: gamePlatformIds }
            }
        });

        if (orderCheck) {
            res.status(400).json({ message: "Le Game est encore présent dans des commandes, suppression impossible" });
            return;
        }

        // Supprimer les game_platform liés
        await GamePlatform.destroy({ where: { game_id: id } });

        // Supprimer le jeu
        await game.destroy();

        res.status(200).json({ message: "Game supprimé avec succès" });
    } catch (error: any) {
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression du jeu" });
    }
}
