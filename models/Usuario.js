import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Usuario = db.define('usuarios', {
  nombre: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(200), allowNull: false },
  telefono: { type: DataTypes.STRING(25), allowNull: true }
});

export default Usuario;
