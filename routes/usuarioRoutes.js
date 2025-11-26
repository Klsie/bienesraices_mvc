import express from 'express';
import { formularioLogin, autenticar, formularioRegistro, registrar, cerrarSesion } from '../controllers/usuarioController.js';
const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.post('/logout', cerrarSesion);

export default router;
