import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Cargo = sequelize.define(
    'cargos',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao: {
            type: DataTypes.STRING(255),
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
export default Cargo