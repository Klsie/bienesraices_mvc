import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Imagen = db.define('imagenes', {
  url: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.STRING(150), allowNull: true },
  orden: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
});

export default Imagen;
