import bcrypt from 'bcrypt';
import { Usuario } from '../models/index.js';

export const formularioLogin = (req, res) => {
  res.render('auth/login', { pagina: 'Iniciar sesión' });
};

export const formularioRegistro = (req, res) => {
  res.render('auth/registro', { pagina: 'Registro agente' });
};

export const registrar = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  // validaciones simples
  if (!nombre || !email || !password) {
    return res.render('auth/registro', { error: 'Completa todos los campos', nombre, email, telefono });
  }

  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    return res.render('auth/registro', { error: 'El correo ya está registrado', nombre, email, telefono });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const usuario = await Usuario.create({ nombre, email, password: hash, telefono });

  // crear sesión
  req.session.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
  res.redirect('/admin');
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('auth/login', { error: 'Ingresa email y contraseña' });
  }

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) return res.render('auth/login', { error: 'Usuario no encontrado' });

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) return res.render('auth/login', { error: 'Contraseña incorrecta' });

  req.session.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
  res.redirect('/admin');
};

export const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
