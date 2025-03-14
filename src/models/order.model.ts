import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Customer from "./customer.model";
import Game from "./game.model";


// Définition des attributs d'un commande
interface OrderAttributes {
    id?: number;
    customer_id: number;
    game_id: number;
    quantity: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: number;
    public customer_id!: number;
    public game_id!: number;
    public quantity!: number;
    public status!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
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
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Game,
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    
    },
    {
        sequelize,
        tableName: "orders",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);
Customer.hasMany(Order, { foreignKey: "customer_id" });
Order.belongsTo(Customer, { foreignKey: "customer_id" });

Game.hasMany(Order, { foreignKey: "game_id" });
Order.belongsTo(Game, { foreignKey: "game_id" });


export default Order;