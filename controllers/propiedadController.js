import { Casa, Imagen, TipoPropiedad } from '../models/index.js';
import fs from 'fs';
import path from 'path';

export const inicioPublico = async (req, res) => {
  const casas = await Casa.findAll({
    include: [{ model: Imagen, limit: 1 }, { model: TipoPropiedad }],
    order: [['createdAt', 'DESC']]
  });
  res.render('paginas/inicio', { pagina: 'Inicio', casas });
};

export const verPropiedadPublica = async (req, res) => {
  const { id } = req.params;
  const casa = await Casa.findByPk(id, { include: [Imagen, TipoPropiedad, 'usuario'] });
  if (!casa) return res.redirect('/');
  res.render('paginas/propiedad', { pagina: casa.titulo, casa });
};

// ADMIN: listar propiedades del agente
export const adminListar = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const casas = await Casa.findAll({ where: { usuarioId }, include: [Imagen, TipoPropiedad] });
  res.render('admin/propiedades/listar', { pagina: 'Mis Propiedades', casas });
};

export const adminCrearForm = async (req, res) => {
  const tipos = await TipoPropiedad.findAll();
  res.render('admin/propiedades/crear', { pagina: 'Crear Propiedad', tipos });
};

export const adminGuardar = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { titulo, precio, descripcion, direccion, tipoId } = req.body;

    // sanitizar/validar básicos
    if (!titulo || !precio || !direccion) {
      return res.render('admin/propiedades/crear', { error: 'Completa los campos obligatorios', titulo, precio, direccion });
    }

    const casa = await Casa.create({ titulo, precio, descripcion, direccion, tipoId, usuarioId });

    // manejar imágenes si vienen
    if (req.files && req.files.length > 0) {
      const imgs = req.files.map((f, i) => ({ url: `/uploads/${f.filename}`, orden: i+1, casaId: casa.id }));
      await Imagen.bulkCreate(imgs);
    }

    res.redirect('/admin/propiedades');
  } catch (error) {
    console.error(error);
    res.render('admin/propiedades/crear', { error: 'Error al guardar la propiedad' });
  }
};

export const adminEditarForm = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.session.usuario.id;
  const casa = await Casa.findOne({ where: { id, usuarioId }, include: [Imagen, TipoPropiedad] });
  if (!casa) return res.redirect('/admin/propiedades');
  const tipos = await TipoPropiedad.findAll();
  res.render('admin/propiedades/editar', { pagina: 'Editar Propiedad', casa, tipos });
};

export const adminActualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.session.usuario.id;
    const casa = await Casa.findOne({ where: { id, usuarioId } });
    if (!casa) return res.redirect('/admin/propiedades');

    const { titulo, precio, descripcion, direccion, tipoId } = req.body;
    await casa.update({ titulo, precio, descripcion, direccion, tipoId });

    // si hay nuevas imágenes, agregar
    if (req.files && req.files.length > 0) {
      const imgs = req.files.map((f, i) => ({ url: `/uploads/${f.filename}`, orden: i+1, casaId: casa.id }));
      await Imagen.bulkCreate(imgs);
    }

    res.redirect('/admin/propiedades');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/propiedades');
  }
};

export const adminEliminar = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.session.usuario.id;
  const casa = await Casa.findOne({ where: { id, usuarioId }, include: [ Imagen ] });
  if (!casa) return res.redirect('/admin/propiedades');

  // eliminar archivos físicos (opcional)
  if (casa.imagenes && casa.imagenes.length) {
    for (const img of casa.imagenes) {
      const ruta = path.join(process.cwd(), 'public', img.url);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }
  }

  await casa.destroy();
  res.redirect('/admin/propiedades');
};
