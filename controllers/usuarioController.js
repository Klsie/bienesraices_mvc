import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario, Casa, Imagen } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERROR: process.env.JWT_SECRET no está definido en .env");
  throw new Error("Falta JWT_SECRET en tu archivo .env");
}

// =======================================
// FORMULARIOS
// =======================================
export const mostrarLogin = (req, res) => {
  res.render('auth/login', { pagina: 'Iniciar sesión' });
};

export const mostrarRegistro = (req, res) => {
  res.render('auth/registro', { pagina: 'Registro agente' });
};

// =======================================
// REGISTRO DE USUARIO
// =======================================
export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.render('auth/registro', {
        pagina: 'Registro agente',
        error: 'Completa todos los campos',
        nombre, email, telefono
      });
    }

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.render('auth/registro', {
        pagina: 'Registro agente',
        error: 'El correo ya está registrado',
        nombre, email, telefono
      });
    }

    // Hash de contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      telefono
    });

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2
    });

    res.redirect('/admin');

  } catch (error) {
    console.log(error);
    res.render('auth/registro', {
      pagina: 'Registro agente',
      error: 'Error interno. Intenta más tarde.'
    });
  }
};

// =======================================
// AUTENTICAR (LOGIN)
// =======================================
export const autenticar = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.render('auth/login', { 
        pagina: 'Iniciar sesión',
        error: 'Usuario no encontrado' 
      });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.render('auth/login', { 
        pagina: 'Iniciar sesión',
        error: 'Contraseña incorrecta' 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '2h' }
    );

    // Guardar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 2
    });

    res.redirect('/admin');

  } catch (error) {
    console.log(error);
    res.render('auth/login', {
      pagina: 'Iniciar sesión',
      error: 'Ocurrió un error. Intenta de nuevo.'
    });
  }
};

// =======================================
// CERRAR SESIÓN
// =======================================
export const cerrarSesion = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// =======================================
// RECUPERAR CONTRASEÑA (PENDIENTE)
// =======================================
export const recuperarPassword = (req, res) => {
  res.render('auth/olvide-password', { pagina: 'Recuperar contraseña' });
};

export const recuperar = async (req, res) => {
  res.send("Por implementar");
};

// =======================================
// PERFIL
// =======================================
export const mostrarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const usuario = await Usuario.findByPk(usuarioId);

    const casas = await Casa.findAll({
      where: { usuarioId },
      include: [{ model: Imagen, as: 'imagenes' }]
    });

    res.render('auth/perfil', {
      pagina: 'Mi Perfil',
      usuario,
      casas
    });

  } catch (error) {
    console.log(error);
    res.redirect('/login');
  }
};
