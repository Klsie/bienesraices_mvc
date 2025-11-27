import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export default async function identificarUsuario(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.locals.usuario = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    res.locals.usuario = usuario || null;
    req.usuario = usuario || null;

    return next();

  } catch (error) {
    res.locals.usuario = null;
    return next();
  }
}
