import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Cargo from "./CargoModel.js";

const Usuario = sequelize.define(
    'usuarios',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email:{
            type: DataTypes.STRING(100),
          
            unique: true
        },
        cpf:{
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true
        },
        estudante:{
            type: DataTypes.BOOLEAN,
            
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Usuario.belongsTo(Cargo, {
    as: 'cargo',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idCargo',
        field: 'id_cargo'
    }
})

export default Usuario