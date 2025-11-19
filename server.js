import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'


try {
    await db.authenticate();
    db.sync() //Sincroniza los modelos con la base de datos
    console.log('Conexion correcta a la base de datos');
} catch (error) {
    console.log('El error de conexion es: ', error);}


// Crear la app Contiene toda la info de express
const app = express()

//Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended:true }))

app.set('view engine','pug')
app.set('views', './views')


//Carpetas publicas
app.use(express.static('public')) //Rutas estaticas

//Routing 
app.use('/auth', usuarioRoutes)

//Habilitar PUG
app.get('/', (req, res) => {
    res.render('auth/login', { pagina: 'Inicio' });
});

// Definir un puerto OBLIGATORIO
const port = 3000;
//Creamos aplicacion 
app.listen(port, () => {

    console.log(`El servidor esta funcionando en el puerto ${port}`);
});