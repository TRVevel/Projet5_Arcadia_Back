import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs d'un Customer
interface CustomerAttributes {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    adress: string;
    hashedpassword: string;
    order_history?: number[];
    createdAt?: Date;
    updatedAt?: Date;
}

class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
    public id!: number;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public phone!: string;
    public adress!: string;
    public hashedpassword!: string;
    public order_history!: number[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Customer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        adress:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        hashedpassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_history: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: [],
        },
    },
    {
        sequelize,
        tableName: "customers",
        timestamps: true, // Ajoute createdAt & updatedAt
    }
);

export default Customer;