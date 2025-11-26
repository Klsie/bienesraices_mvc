import express from 'express';
import {
    mostrarLogin,
    autenticar,
    mostrarRegistro,
    registrar,
    cerrarSesion
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', mostrarLogin);
router.post('/login', autenticar);

router.get('/registro', mostrarRegistro);
router.post('/registro', registrar);

router.get('/logout', cerrarSesion);

export default router;
