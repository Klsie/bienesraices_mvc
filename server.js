import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import db from './config/db.js';

// Rutas
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadRoutes from './routes/propiedadRoutes.js';
import routes from './routes/index.js';

// Middleware que llena req.usuario
import protegerRuta from './middlewares/protegerRuta.js';

dotenv.config({ path: '.env' });

const app = express();

// Middlewares esenciales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Archivos estáticos (CSS, imágenes, JS del frontend)
app.use(express.static(path.resolve('public')));

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.resolve('views'));

// 🔥 --- NUEVO Y NECESARIO ---
// Pasar usuario autenticado a TODAS las vistas Pug
app.use(async (req, res, next) => {
    res.locals.usuario = req.usuario || null; // ← Lo que pide tu navbar
    next();
});

// Rutas
app.use('/', routes);            
app.use('/', usuarioRoutes);    
app.use('/', propiedadRoutes);  

// Conectar a la base de datos
const start = async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Base de datos conectada');

        const port = process.env.PORT || 3000;
        app.listen(port, () =>
            console.log(`Servidor en puerto ${port}`)
        );
    } catch (error) {
        console.error('Error al iniciar la app:', error);
    }
};

start();

