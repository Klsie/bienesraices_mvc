import Usuario from './Usuario.js';
import Casa from './Casas.js';
import TipoPropiedad from './TipoPropiedad.js';
import Imagen from './Imagen.js';

// Usuario 1:N Casa
Usuario.hasMany(Casa, { foreignKey: 'usuarioId', as: 'casas' });
Casa.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// TipoPropiedad 1:N Casa
TipoPropiedad.hasMany(Casa, { foreignKey: 'tipoId', as: 'casas' });
Casa.belongsTo(TipoPropiedad, { foreignKey: 'tipoId', as: 'tipo' });

// Casa 1:N Imagen
Casa.hasMany(Imagen, { foreignKey: 'casaId', as: 'imagenes', onDelete: 'CASCADE' });
Imagen.belongsTo(Casa, { foreignKey: 'casaId', as: 'casa' });



export { Usuario, Casa, TipoPropiedad, Imagen };
