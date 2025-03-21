import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Game from "./game.model";
import Platform from "./platform.model";

interface GamePlatformAttributes {
    game_id?: number;
    platform_id?: number;
    compatible_devices?: string[];
}

class GamePlatform extends Model<GamePlatformAttributes> implements GamePlatformAttributes{
    public game_id!: number;
    public platform_id!: number;
    public compatible_devices!: string[];
}

GamePlatform.init(
    {
        game_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Game,
                key: "id",
            },
            onDelete: "CASCADE",
            primaryKey: true,
        },
        platform_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Platform,
                key: "id",
            },
            onDelete: "CASCADE",
            primaryKey: true,
        },
        compatible_devices: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            validate: {
                // Validation personnalisée
                async areDevicesValid(value: string[]) {
                    const platform = await Platform.findByPk(this.platform_id as number); // Récupérer la plateforme associée
                    if (!platform) {
                        throw new Error(`Platform with id ${this.platform_id} does not exist.`);
                    }

                    // Supposons que chaque plateforme ait un attribut 'devices' qui contient les devices compatibles
                    const validDevices = platform.devices;  // Liste des dispositifs valides pour cette plateforme
                    const invalidDevices = value.filter(device => !validDevices.includes(device));
                    if (invalidDevices.length > 0) {
                        throw new Error(`Invalid devices: ${invalidDevices.join(", ")}`);
                    }
                }
            }
        },
    },
    {
        sequelize,
        tableName: "game_platforms",
        timestamps: false, // Pas besoin de createdAt / updatedAt
    }
);

// Définir les relations Many-to-Many
Game.belongsToMany(Platform, { through: GamePlatform, foreignKey: "game_id" });
Platform.belongsToMany(Game, { through: GamePlatform, foreignKey: "platform_id" });

export default GamePlatform;