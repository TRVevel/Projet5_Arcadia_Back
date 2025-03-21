import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Platform from "./platform.model";
import GamePlatform from "./game_platforms.model";

interface GameAttributes {
    id?: number;
    title: string;
    description: string;
    genre: string;
    sub_genres?: string[]|null;
    pegi: 3 | 7 | 12 | 16 | 18;
    sensitive_content?: string[]|null;
    price: number;
    release_date: Date;
    image?: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Game extends Model<GameAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public genre!: string;
    public sub_genres!: string[]|null;
    public pegi!: 3 | 7 | 12 | 16 | 18;
    public sensitive_content!: string[]|null;
    public price!: number;
    public release_date!: Date;
    public image!: string;
    public stock!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sub_genres: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            validate: {
                // Vérifie que chaque élément du tableau correspond à un motif précis (ici une chaîne avec des lettres et chiffres)
                isArrayValid(value: string[]) {
                    if (!value.every(item => /^[A-Za-z0-9& ]+$/.test(item))) {
                        throw new Error("Each sub_genre must contain only letters, numbers, and '&'");
                    }
                },
            },
        },
        pegi: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[3, 7, 12, 16, 18]],
            },
        },
        sensitive_content: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,  // Cette valeur peut être facultative
            validate: {
                isValidContent(value: string[]) { // Spécifiez explicitement que value est un tableau de chaînes de caractères
                    if (value && Array.isArray(value)) {
                        // Valide chaque élément du tableau
                        for (const item of value) {
                            if (!['Violence', 'Sexual Content', 'Drugs', 'Gambling', 'Bad Language'].includes(item)) {
                                throw new Error(`${item} n'est pas un contenu sensible valide`);
                            }
                        }
                    }
                },
            },
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
            allowNull: true,
            type: DataTypes.STRING,
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
        tableName: "games",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);

export default Game;
