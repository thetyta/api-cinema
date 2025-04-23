import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Filme from "./FilmesModel.js";
import Sala from "./SalasModel.js";

const Sessao = sequelize.define(
    'sessoes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataInicio:{
            field: 'data_inicio',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        lugares: {
            type: DataTypes.JSONB,
        },
        dataFim:{
            field: 'data_fim',
            type: DataTypes.DATE,
        },
        preco:{
            type: DataTypes.FLOAT,
            allowNull:false
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Sessao.belongsTo(Filme, {
    as: 'filme',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idFilme',
        allowNull: false,
        field: 'id_filme'
    }
})

Sessao.belongsTo(Sala, {
    as: 'sala',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idSala',
        allowNull: false,
        field: 'id_sala'
    }
})

export default Sessao