import express from 'express';
import multer from 'multer';
import path from 'path';
import protegerRuta from '../middlewares/protegerRuta.js';
import {
  paginaInicio,
  admin,
  formularioCrear,
  guardar,
  formularioImagen,
  guardarImagen,
  formularioEditar,
  guardarEdicion,
  eliminar,
  verPropiedad
} from '../controllers/propiedadController.js';



// Configuración de multer para subir imágenes
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

const router = express.Router();

// -----------------------------
// Rutas Público
// -----------------------------
router.get('/', paginaInicio);

// -----------------------------
// Panel / CRUD Propiedades
// -----------------------------
router.get('/admin', protegerRuta, admin);

// Ver propiedad
router.get('/propiedades/:id', verPropiedad);

router.get('/propiedades/crear', protegerRuta, formularioCrear);
router.post('/propiedades/crear', protegerRuta, guardar);

// imagen
router.get('/propiedades/imagen/:id', protegerRuta, formularioImagen);
router.post('/propiedades/imagen/:id', protegerRuta, upload.single('imagen'), guardarImagen);

// editar
router.get('/propiedades/editar/:id', protegerRuta, formularioEditar);
router.post('/propiedades/editar/:id', protegerRuta, guardarEdicion);

// eliminar
router.post('/propiedades/eliminar/:id', protegerRuta, eliminar);

export default router;
