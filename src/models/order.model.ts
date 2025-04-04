import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Customer from "./customer.model";
import Game from "./game.model";
import GamePlatform from "./game_platforms.model";


// Définition des attributs d'un commande
interface OrderAttributes {
    id?: number;
    customer_id: number;
    adress?: string;
    total_price?: number;
    status?: "pending" | "shipped" | "delivered" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: number;
    public customer_id!: number;
    public adress!: string;
    public total_price!: number;
    public status!: "pending" | "shipped" | "delivered" | "cancelled";
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
        adress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            },
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending",
            validate:{
                isIn: [["pending", "shipped", "delivered", "cancelled"]]
            }
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


export default Order;