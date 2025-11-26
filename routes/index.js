import express from 'express';
import usuarioRoutes from './usuarioRoutes.js';

const router = express.Router();

router.use('/', usuarioRoutes);

export default router;
