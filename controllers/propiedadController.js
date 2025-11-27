import { Casa, Imagen, Usuario,TipoPropiedad } from '../models/index.js';
import path from 'path';
import fs from 'fs';

// ----------------------------
// Página principal (público)
// ----------------------------
export const paginaInicio = async (req, res) => {
  const casas = await Casa.findAll({
    include: [{ model: Imagen ,as: 'imagenes' }],
    limit: 10
  });

  res.render('layout/index', {
    pagina: 'Bienes Raíces',
    casas
  });
};

// ----------------------------
// Panel administrador
// ----------------------------
export const admin = async (req, res) => {
  const usuarioId = req.usuario.id;

  const casas = await Casa.findAll({
    include: [{ model: Imagen, as: 'imagenes' }],
    order: [['id', 'DESC']]
  });

  res.render('auth/casas', {
    pagina: 'Mis Propiedades',
    casas
  });
};

// ----------------------------
// Formulario crear propiedad
// ----------------------------
export const formularioCrear = (req, res) => {
  res.render('auth/casas', {
    pagina: 'Crear Propiedad',
    crear: true
  });
};

// ----------------------------
// Guardar propiedad
// ----------------------------
export const guardar = async (req, res) => {
  const { titulo, precio, descripcion, direccion } = req.body;

  if (!titulo || !precio) {
    return res.render('auth/casas', {
      pagina: 'Crear Propiedad',
      error: 'Completa los campos obligatorios',
      datos: req.body
    });
  }

  const usuarioId = req.session.usuario.id;

  const casa = await Casa.create({
    titulo,
    precio,
    descripcion,
    direccion,
    usuarioId
  });

  res.redirect(`/propiedades/imagen/${casa.id}`);
};

// ----------------------------
// Formulario subir imagen
// ----------------------------
export const formularioImagen = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id);

  if (!casa) return res.redirect('/admin');

  res.render('auth/casas', {
    pagina: 'Subir Imagen',
    subirImagen: true,
    casa
  });
};

// ----------------------------
// Guardar imagen
// ----------------------------
export const guardarImagen = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id);
  if (!casa) return res.redirect('/admin');

  if (!req.file) {
    return res.render('auth/casas', {
      pagina: 'Subir Imagen',
      subirImagen: true,
      casa,
      error: 'Debes seleccionar una imagen'
    });
  }

  await Imagen.create({
    nombre: req.file.filename,
    casaId: casa.id
  });

  res.redirect('/admin');
};

// ----------------------------
// Formulario editar propiedad
// ----------------------------
export const formularioEditar = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id);

  if (!casa) return res.redirect('/admin');

  res.render('auth/casas', {
    pagina: 'Editar Propiedad',
    editar: true,
    casa
  });
};

// ----------------------------
// Guardar edición
// ----------------------------
export const guardarEdicion = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id);
  if (!casa) return res.redirect('/admin');

  const { titulo, precio, descripcion, direccion } = req.body;

  await casa.update({
    titulo,
    precio,
    descripcion,
    direccion
  });

  res.redirect('/admin');
};

// ----------------------------
// Eliminar propiedad
// ----------------------------
export const eliminar = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id);
  if (!casa) return res.redirect('/admin');

  // borrar imagen física si existe
  const imagen = await Imagen.findOne({ where: { casaId: casa.id } });

  if (imagen) {
    const ruta = path.resolve(`public/uploads/${imagen.nombre}`);
    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

    await imagen.destroy();
  }

  await casa.destroy();
  res.redirect('/admin');
};

// ----------------------------
// Ver Propiedad Detallada
// ----------------------------
export const verPropiedad = async (req, res) => {
    const { id } = req.params;

    const casa = await Casa.findByPk(id, {
        include: [
            { model: Imagen, as: 'imagenes' },
            { model: Usuario, as: 'usuario' },
            { model: TipoPropiedad, as: 'tipo' }
        ]
    });

      console.log(casa.toJSON()); // <--- AGREGA ESTO


    if (!casa) {
        return res.render('404', { pagina: 'Propiedad no encontrada' });
    }

    res.render('auth/casa', {
        pagina: casa.titulo,
        casa
    });
};
