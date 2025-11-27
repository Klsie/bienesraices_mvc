import express from 'express';
import multer from 'multer';
import path from 'path';
import protegerRuta from '../middlewares/protegerRuta.js';

import {
  paginaInicio,
  admin,
  crearPropiedad,
  guardarPropiedad,
  editarPropiedad,
  guardarCambiosPropiedad,
  borrarImagen,
  verPropiedad,eliminar
} from '../controllers/propiedadController.js';

// -----------------------------------------
// MULTER — Subida de múltiples imágenes
// -----------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = Date.now() + ext;
    cb(null, nombre);
  }
});

const upload = multer({ storage });

// -----------------------------------------
const router = express.Router();

// ============ RUTAS PÚBLICAS =============
router.get('/', paginaInicio);
router.get('/propiedades/:id', verPropiedad);

// ============ ADMIN / CRUD ===============
router.get('/admin', protegerRuta, admin);

// Crear propiedad
router.get('/propiedades/crear', protegerRuta, crearPropiedad);
router.post(
  '/propiedades/crear',
  protegerRuta,
  upload.array('imagenes'),   // <<< SUBIR VARIAS IMÁGENES
  guardarPropiedad
);

// Editar propiedad
router.get('/propiedades/editar/:id', protegerRuta, editarPropiedad);
router.post(
  '/propiedades/editar/:id',
  protegerRuta,
  upload.array('imagenes'),   // <<< TAMBIÉN PERMITE NUEVAS IMÁGENES
  guardarCambiosPropiedad
);

// Borrar una imagen individual (AJAX)
router.delete('/imagenes/:id', protegerRuta, borrarImagen);

// Eliminar propiedad completa
router.post('/propiedades/eliminar/:id', protegerRuta, eliminar);

export default router;
