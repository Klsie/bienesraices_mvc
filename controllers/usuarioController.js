import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';


export const mostrarLogin = (req, res) => {
  res.render('auth/login', { pagina: 'Iniciar sesión' });
};

export const mostrarRegistro = (req, res) => {
  res.render('auth/registro', { pagina: 'Registro agente' });
};

export const registrar = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  if (!nombre || !email || !password) {
    return res.render('auth/registro', {
      error: 'Completa todos los campos',
      nombre, email, telefono
    });
  }

  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    return res.render('auth/registro', {
      error: 'El correo ya está registrado',
      nombre, email, telefono
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.create({ nombre, email, password: hash, telefono });

  // generar token
  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  });

  res.redirect('/admin');
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render('auth/login', { error: 'Usuario no encontrado' });
  }

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) {
    return res.render('auth/login', { error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  });

  res.redirect('/admin');
};

export const cerrarSesion = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

export const recuperarPassword = (req, res) => {
  res.render('auth/olvide-password', { pagina: 'Recuperar contraseña' });
}

export const recuperar = async (req, res) => {
  // Lógica para recuperar la contraseña
  "Por implementar"
  
};