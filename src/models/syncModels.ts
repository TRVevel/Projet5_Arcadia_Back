import sequelize from "../config/database";
import User from "./user.model";
import Customer from "./customer.model";
import Game from "./game.model";
import Order from "./order.model";
import Platform from "./platform.model";
import GamePlatform from "./game_platforms.model";

const syncDatabase = async () => {
    try {
    //alter: true Met à jour la structure automatiquement la structure de la base de données
    //à utiliser sans options pour utiliser les migrations en production.
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée");
    } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
    }
    };
    export { syncDatabase, User, Customer, Game, Platform, GamePlatform, Order };