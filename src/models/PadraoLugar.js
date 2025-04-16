import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Padrao = sequelize.define(
    'padrao_lugares',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lugares: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)
export default Padrao