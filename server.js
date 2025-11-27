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

dotenv.config({ path: '.env' });

const app = express();

// Middlewares esenciales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Archivos estáticos (CSS, imágenes, JS del frontend)
app.use(express.static(path.resolve('public')));

// PUG
app.set('view engine', 'pug');
app.set('views', path.resolve('views'));

// Pasar sesión a las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Rutas
app.use('/', routes);            // rutas principales
app.use('/', usuarioRoutes);     // login, registro, perfil
app.use('/', propiedadRoutes);   // CRUD propiedades

// Conectar DB y sincronizar sin borrar datos
const start = async () => {
    try {
        await db.authenticate();
        await db.sync(); // NO usa force ni alter → no borra tablas
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
