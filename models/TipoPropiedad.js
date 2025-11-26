import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const TipoPropiedad = db.define('tipopropiedad', {
  nombreTipo: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.STRING(255), allowNull: true }
});

export default TipoPropiedad;
