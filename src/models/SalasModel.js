import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Padrao from "./PadraoLugar.js";

const Sala = sequelize.define(
    'salas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        observacao: {
            type: DataTypes.STRING(255)
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Sala.belongsTo(Padrao, {
    as: 'padrao',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idPadrao',
        allowNull: false,
        field: 'id_padrao'
    }
})

export default Sala