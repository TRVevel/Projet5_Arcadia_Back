import Game from "../models/game.model";
import GamePlatform from "../models/game_platforms.model";

export const checkGameStatus = async () => {
    try {
        console.log("Vérification du statut des jeux...");

        // Récupérer tous les jeux ayant au moins une plateforme
        const gamePlatforms = await GamePlatform.findAll({
            attributes: ["game_id", "status"],
            raw: true,
        });

        // Regrouper par game_id
        const gameStatusMap = new Map<number, boolean[]>();

        gamePlatforms.forEach(({ game_id, status }) => {
            if (!gameStatusMap.has(game_id)) {
                gameStatusMap.set(game_id, []);
            }
            gameStatusMap.get(game_id)!.push(status);
        });

        // Vérifier si tous les statuts d'un jeu sont "false"
        for (const [game_id, statuses] of gameStatusMap.entries()) {
            if (statuses.every(status => status === false)) {
                console.log(`Mise à jour du statut du jeu ${game_id} en false`);
                await Game.update({ status: false }, { where: { id: game_id } });
            }
        }

        console.log("Vérification terminée !");
    } catch (error) {
        console.error("Erreur lors de la vérification des statuts des jeux :", error);
    }
};