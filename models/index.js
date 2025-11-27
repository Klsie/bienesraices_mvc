import Usuario from './Usuario.js';
import Casa from './Casas.js';
import TipoPropiedad from './TipoPropiedad.js';
import Imagen from './Imagen.js';

// Usuario 1:N Casa
Usuario.hasMany(Casa, { as: 'casas', foreignKey: 'usuarioId' });
Casa.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuarioId' });

// TipoPropiedad 1:N Casa
TipoPropiedad.hasMany(Casa, { as: 'casas', foreignKey: 'tipoId' });
Casa.belongsTo(TipoPropiedad, { as: 'tipo', foreignKey: 'tipoId' });

// Casa 1:N Imagen
Casa.hasMany(Imagen, { 
  as: 'imagenes',
  foreignKey: 'casaId',
  onDelete: 'CASCADE'
});
Imagen.belongsTo(Casa, { as: 'casa', foreignKey: 'casaId' });


export { Usuario, Casa, TipoPropiedad, Imagen };
