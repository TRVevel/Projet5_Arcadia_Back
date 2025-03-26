import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Game from "./game.model";
import Platform from "./platform.model";

interface GamePlatformAttributes {
    id?: number;
    game_id?: number;
    platform_id?: number;
    compatible_device?: string;
    price: number;
    release_date: Date;
    image?: string;
    stock: number;
}

class GamePlatform extends Model<GamePlatformAttributes> implements GamePlatformAttributes {
    public id!: number;
    public game_id!: number;
    public platform_id!: number;
    public compatible_device!: string;
    public price!: number;
    public release_date!: Date;
    public image!: string;
    public stock!: number;
}

GamePlatform.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Game,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        platform_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Platform,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        compatible_device: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            },
        },
        release_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 0,
            },
        },
    },
    {
        sequelize,
        tableName: "game_platforms",
        timestamps: false, // Pas besoin de createdAt / updatedAt
        indexes: [
            {
                unique: true,
                fields: ["game_id", "platform_id", "compatible_device"], // ✅ Empêche uniquement les doublons exacts
            },
        ],
    }
);

// Définir les relations Many-to-Many
Game.belongsToMany(Platform, { through: { model: GamePlatform, unique: false }, foreignKey: "game_id" });
Platform.belongsToMany(Game, { through: { model: GamePlatform, unique: false }, foreignKey: "platform_id" });

export default GamePlatform;
