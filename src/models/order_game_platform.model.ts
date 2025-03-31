import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Customer from "./customer.model";
import Game from "./game.model";
import GamePlatform from "./game_platforms.model";
import Order from "./order.model";


// Définition des attributs d'un commande
interface OrderGamePlatformAttributes {
    id?: number;
    order_id?: number;
    game_platform_id: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class OrderGamePlatform extends Model<OrderGamePlatformAttributes> implements OrderGamePlatformAttributes {
    public id!: number;
    public order_id!: number;
    public game_platform_id!: number;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderGamePlatform.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
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
    
    },
    {
        sequelize,
        tableName: "orders_game_platforms",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);
Order.hasMany(OrderGamePlatform, { foreignKey: "order_id" });
OrderGamePlatform.belongsTo(Order, { foreignKey: "order_id" });

GamePlatform.hasMany(OrderGamePlatform, { foreignKey: "game_platform_id" });
OrderGamePlatform.belongsTo(GamePlatform, { foreignKey: "game_platform_id" });


export default OrderGamePlatform;