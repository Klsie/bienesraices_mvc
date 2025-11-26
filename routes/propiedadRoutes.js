import express from 'express';
import multer from 'multer';
import { protegerRuta } from '../middlewares/auth.js';
import {
  inicioPublico, verPropiedadPublica,
  adminListar, adminCrearForm, adminGuardar, adminEditarForm, adminActualizar, adminEliminar
} from '../controllers/propiedadController.js';

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* Public */
router.get('/', inicioPublico);
router.get('/propiedad/:id', verPropiedadPublica);

/* Admin (agente) */
router.get('/admin', protegerRuta, adminListar);
router.get('/admin/propiedades', protegerRuta, adminListar);
router.get('/admin/propiedades/crear', protegerRuta, adminCrearForm);
router.post('/admin/propiedades/crear', protegerRuta, upload.array('imagenes', 6), adminGuardar);
router.get('/admin/propiedades/editar/:id', protegerRuta, adminEditarForm);
router.post('/admin/propiedades/editar/:id', protegerRuta, upload.array('imagenes', 6), adminActualizar);
router.post('/admin/propiedades/eliminar/:id', protegerRuta, adminEliminar);

export default router;
