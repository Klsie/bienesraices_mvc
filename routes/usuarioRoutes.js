import express from 'express';
import protegerRuta from '../middlewares/protegerRuta.js';
import {
    mostrarLogin,
    autenticar,
    mostrarRegistro,
    registrar,
    cerrarSesion,
    recuperarPassword,
    recuperar,
    mostrarPerfil
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', mostrarLogin);
router.post('/login/ingresar', autenticar);

router.get('/perfil', protegerRuta, mostrarPerfil);

router.get('/registro', mostrarRegistro);
router.post('/registro', registrar);

router.get('/olvide-password', recuperarPassword);
router.post('/olvide-password',recuperar);

router.get('/logout', cerrarSesion);

export default router;
