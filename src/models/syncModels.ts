import sequelize from "../config/database";
import User from "./staff.model";
import Customer from "./customer.model";
import Game from "./game.model";
import Order from "./order.model";
import Platform from "./platform.model";
import GamePlatform from "./game_platforms.model";
import OrderGamePlatform from "./order_game_platform.model";
import { checkGameStatus } from "../utils/verifUtils";

const syncDatabase = async () => {
    try {
        // Synchronisation de la base de données
        await sequelize.sync({ alter: true });

        // Vérification de la connexion
        await sequelize.authenticate();

        // Exécuter la vérification des statuts des jeux
        await checkGameStatus();

        console.log("Base de données synchronisée");
    } catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
    }
};

    export { syncDatabase, User, Customer, Game, Platform, GamePlatform, Order, OrderGamePlatform };