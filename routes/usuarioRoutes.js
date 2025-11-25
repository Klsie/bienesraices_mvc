import express from 'express';
import {formularioLogin,formularioRegistro,formularioOlvidePassword,registrar, listaCasas} from '../controllers/usuarioController.js'



const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro); // ENDPOINT's
router.post('/registro', registrar);
router.get('/olvide-password', formularioOlvidePassword);
router.get('/casas', listaCasas);
//Duplicar rutas
//router.get('/auth/login', formularioLogin);
//router.get('/auth/registro', formularioRegistro);
//Para que funcionen las rutas en server.js



export default router
