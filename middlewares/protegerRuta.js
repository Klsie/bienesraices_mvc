import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    res.locals.usuario = decodificado;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
