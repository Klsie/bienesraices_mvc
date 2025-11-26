import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Usuario from './Usuario.js';
import TipoPropiedad from './TipoPropiedad.js';

const Casa = db.define('casas', {
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  direccion: { type: DataTypes.STRING(255), allowNull: false }
});

// Relaciones: se definen en associations.js o en server.js
export default Casa;
