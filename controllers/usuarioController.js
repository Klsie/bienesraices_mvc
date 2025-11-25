import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login',{
       pagina: 'Iniciar Sesión',
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',{
        pagina: 'Crear Cuenta',

    })
}

const registrar = async(req, res) => {
    const usuario = await Usuario.create(req.body)

    res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recuperar Contraseña',

    })
}

const listaCasas = (req, res) => {
    res.render('auth/casas',{
        pagina: 'Lista de casas',
    })
}

export {
    formularioLogin,
    registrar,
    formularioRegistro,
    formularioOlvidePassword,
    listaCasas
}