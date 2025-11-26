import Usuario from './Usuario.js';
import Casa from './Casas.js';
import TipoPropiedad from './TipoPropiedad.js';
import Imagen from './Imagen.js';

// Usuario 1:N Casa
Usuario.hasMany(Casa, { foreignKey: 'usuarioId' });
Casa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// TipoPropiedad 1:N Casa
TipoPropiedad.hasMany(Casa, { foreignKey: 'tipoId' });
Casa.belongsTo(TipoPropiedad, { foreignKey: 'tipoId' });

// Casa 1:N Imagen
Casa.hasMany(Imagen, { foreignKey: 'casaId', onDelete: 'CASCADE' });
Imagen.belongsTo(Casa, { foreignKey: 'casaId' });

export { Usuario, Casa, TipoPropiedad, Imagen };
