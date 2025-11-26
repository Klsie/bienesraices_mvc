import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import db from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadRoutes from './routes/propiedadRoutes.js';
import { Usuario, Casa, TipoPropiedad, Imagen } from './models/index.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve('public')));

app.use(session({
  secret: process.env.SESSION_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// motor pug
app.set('view engine', 'pug');
app.set('views', path.resolve('views'));

// pasar session a vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// rutas
app.use('/', usuarioRoutes);
app.use('/', propiedadRoutes);

// conectar y sync
const start = async () => {
  try {
    await db.authenticate();
    // crear tablas si no existen
    await db.sync();
    console.log('DB conectada y sincronizada');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log('Servidor en puerto', port));
  } catch (error) {
    console.error('Error al iniciar app:', error);
  }
};

start();
