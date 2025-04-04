import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Customer from "./customer.model";
import Game from "./game.model";
import GamePlatform from "./game_platforms.model";


// Définition des attributs d'un commande
interface BasketAttributes {
    id?: number;
    customer_id: number;
    game_platform_id: number;
    quantity: number;
    total_price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Basket extends Model<BasketAttributes> implements BasketAttributes {
    public id!: number;
    public customer_id!: number;
    public game_platform_id!: number;
    public quantity!: number;
    public total_price!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Basket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: "id",
            },
        },
        game_platform_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: GamePlatform,
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            },
        }
    
    },
    {
        sequelize,
        tableName: "baskets",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);
Customer.hasMany(Basket, { foreignKey: "customer_id" });
Basket.belongsTo(Customer, { foreignKey: "customer_id" });

GamePlatform.hasMany(Basket, { foreignKey: "game_platform_id" });
Basket.belongsTo(GamePlatform, { foreignKey: "game_platform_id" });


export default Basket;