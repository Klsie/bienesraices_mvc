import { Casa, Imagen, Usuario, TipoPropiedad } from '../models/index.js';
import path from 'path';
import fs from 'fs';

// ----------------------------
// Página principal (público)
// ----------------------------
export const paginaInicio = async (req, res) => {
  const casas = await Casa.findAll({
    include: [{ model: Imagen, as: 'imagenes' }],
    limit: 10,
    order: [['id', 'DESC']]
  });
    // Usa la vista de listado (casas.pug dentro de /auth)
  res.render('auth/casas', {
    pagina: 'Bienes Raíces',
    casas,
    esAdmin: false
  });

  
};

// ----------------------------
// Panel administrador
// ----------------------------
export const admin = async (req, res) => {
  const usuarioId = req.usuario.id;

  const casas = await Casa.findAll({
    where: { usuarioId },
    include: [{ model: Imagen, as: 'imagenes' }],
    order: [['id', 'DESC']]
  });

  res.render('auth/casas', {
    pagina: 'Mis Propiedades',
    casas,
    esAdmin: true
  });
};

// ----------------------------
// Formulario crear propiedad
// ----------------------------
export const crearPropiedad = (req, res) => {
  res.render('auth/editCasa', {
    pagina: 'Crear propiedad',
    accion: 'crear',
    casa: {},
    imagenes: []
  });
};

// ----------------------------
// Guardar nueva propiedad
// ----------------------------
export const guardarPropiedad = async (req, res) => {
  const { titulo, precio, descripcion, direccion } = req.body;

  // Aquí podrías agregar validaciones si quieres
  const nueva = await Casa.create({
    titulo,
    precio,
    descripcion,
    direccion,
    usuarioId: req.usuario.id
  });

  // Si subió imágenes
  if (req.files?.length) {
    const imagenes = req.files.map(file => ({
      nombre: file.filename,    // campo en tabla Imagen
      casaId: nueva.id
    }));

    await Imagen.bulkCreate(imagenes);
  }

  res.redirect('/admin');
};

// ----------------------------
// Formulario editar propiedad
// ----------------------------
export const editarPropiedad = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id, {
    include: [{ model: Imagen, as: 'imagenes' }]
  });

  if (!casa) return res.redirect('/admin');

  res.render('auth/editCasa', {
    pagina: 'Editar propiedad',
    accion: 'editar',
    casa,
    imagenes: casa.imagenes || []
  });
};

// ----------------------------
// Guardar cambios de propiedad
// ----------------------------
export const guardarCambiosPropiedad = async (req, res) => {
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

  // Si se suben nuevas imágenes
  if (req.files?.length) {
    const imagenes = req.files.map(file => ({
      nombre: file.filename,
      casaId: casa.id
    }));

    await Imagen.bulkCreate(imagenes);
  }

  res.redirect(`/propiedades/editar/${id}`);
};

// ----------------------------
// Eliminar imagen individual (AJAX)
// ----------------------------
export const borrarImagen = async (req, res) => {
  const { id } = req.params;

  const img = await Imagen.findByPk(id);
  if (!img) return res.status(404).json({ error: 'Imagen no encontrada' });

  const ruta = path.resolve(`public/uploads/${img.nombre}`);
  if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

  await img.destroy();

  res.json({ success: true });
};

// ----------------------------
// Eliminar propiedad completa
// ----------------------------
export const eliminar = async (req, res) => {
  const { id } = req.params;

  const casa = await Casa.findByPk(id, {
    include: [{ model: Imagen, as: 'imagenes' }]
  });

  if (!casa) return res.redirect('/admin');

  // Borrar imágenes físicas
  for (const img of casa.imagenes) {
    const ruta = path.resolve(`public/uploads/${img.nombre}`);
    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    await img.destroy();
  }

  await casa.destroy();

  res.redirect('/admin');
};

// ----------------------------
// Ver Propiedad Detallada (página pública)
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

  if (!casa) {
    return res.render('404', { pagina: 'Propiedad no encontrada' });
  }

  res.render('auth/casa', {
    pagina: casa.titulo,
    casa
  });
};
