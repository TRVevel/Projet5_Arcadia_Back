import Game from "../models/game.model";
import GamePlatform from "../models/game_platforms.model";

/**
 * Met à jour le statut des jeux : si toutes les plateformes d'un jeu sont désactivées (status=false),
 * alors le jeu est aussi désactivé (status=false).
 */
export const checkGameStatus = async () => {
    try {
        // Récupérer tous les statuts des plateformes de jeux
        const gamePlatforms = await GamePlatform.findAll({
            attributes: ["game_id", "status"],
            raw: true,
        });

        // Regrouper les statuts par game_id
        const gameStatusMap = new Map<number, boolean[]>();
        for (const { game_id, status } of gamePlatforms) {
            if (!gameStatusMap.has(game_id)) {
                gameStatusMap.set(game_id, []);
            }
            gameStatusMap.get(game_id)!.push(status);
        }

        // Mettre à jour le statut du jeu si toutes ses plateformes sont désactivées
        for (const [game_id, statuses] of gameStatusMap.entries()) {
            if (statuses.length > 0 && statuses.every(status => status === false)) {
                await Game.update({ status: false }, { where: { id: game_id } });
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des statuts des jeux :", error);
    }
};