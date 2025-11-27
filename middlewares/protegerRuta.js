import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export default async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    // Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario real en la BD
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    // Guardar en req para controladores
    req.usuario = usuario;

    // Guardar en res.locals para PUG (navbar dinámico)
    res.locals.usuario = usuario;

    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
