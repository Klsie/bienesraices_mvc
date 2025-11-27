import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decoded  = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

