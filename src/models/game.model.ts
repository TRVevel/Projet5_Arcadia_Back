import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface GameAttributes {
    id?: number;
    title: string;
    description: string;
    developer: string;
    publisher: string;
    genre: string;
    sub_genres: string[];
    pegi: 3 | 7 | 12 | 16 | 18;
    sensitive_content: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class Game extends Model<GameAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public developer!: string;
    public publisher!: string;
    public genre!: string;
    public sub_genres!: string[];
    public pegi!: 3 | 7 | 12 | 16 | 18;
    public sensitive_content!: string;
    public status!: boolean;
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
        developer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publisher: {
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
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: "games",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["title", "description", "genre"],
            },
        ],
    }
);

export default Game;
