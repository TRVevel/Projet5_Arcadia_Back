import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Définition des attributs d'un utilisateur
interface PlatformAttributes {
    id?: number;
    name: string;
    devices: string[];
}

class Platform extends Model<PlatformAttributes> implements PlatformAttributes {
    public id!: number;
    public name!: string;
    public devices!: string[];
}

Platform.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        devices: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "platforms",
        timestamps: false, // Ajoute createdAt & updatedAt
    }
);

export default Platform;