export const protegerRuta = (req, res, next) => {
  if (req.session && req.session.usuario && req.session.usuario.id) {
    return next();
  }
  return res.redirect('/login');
};