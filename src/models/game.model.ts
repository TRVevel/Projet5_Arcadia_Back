import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Platform from "./platform.model";
import GamePlatform from "./game_platforms.model";

interface GameAttributes {
    id?: number;
    title: string;
    description: string;
    genre: string;
    sub_genres: string[];
    pegi: 3 | 7 | 12 | 16 | 18;
    sensitive_content: string;
    price: number;
    realease_date: Date;
    platforms_data: object;
}

class Game extends Model<GameAttributes> implements GameAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public genre!: string;
    public sub_genres!: string[];
    public pegi!: 3 | 7 | 12 | 16 | 18;
    public sensitive_content!: string;
    public price!: number;
    public realease_date!: Date;
    public platforms_data!: object; 
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
            allowNull: false,
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
        price: {
            type: DataTypes.DECIMAL,
            validate: {
                isDecimal: true,
                min: 0,
            },
        },
        realease_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        platforms_data: {
            type: DataTypes.JSONB, 
        },
    },
    {
        sequelize,
        tableName: "games",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);

export default Game;
