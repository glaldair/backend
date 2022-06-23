const session = require('express-session');

const Usuarios = require('../models/Usuarios.js');
    const usuarios = new Usuarios('sesiones');
    usuarios.guardarArchivo();

function intro (req, res) {
    if (req.session?.logged){
        res.render('ok-login', { title: `Hola ${req.session.user}` });
    } else {
        res.render('intro');
    }
}
function login (req, res) {
    res.render('login');
}
async function postLogin (req, res) {
    const usuario = req.body;
    if(usuario) {
        req.session.user = usuario.username;
        req.session.email = usuario.email;
        req.session.password = usuario.password;
        req.session.logged = true;
        res.render('ok-login', { title: `Hola ${req.session.user}` });
    } else {
        res.send('error')
    }
}

async function sesion (req, res) {
    if (req.session) {
        res.render('sesion', { name: req.session.user });
    } else {
        res.redirect('login');
    }
}
async function deleteSesion(req, res){
    const user = req.session.user;
    await usuarios.deleteUser(user)
        .then(response => {
            res.send(`Adios ${user}`);
            console.log(response);
        })
        .catch(err => {
            res.send('error');
            console.log(err);
        })
}

module.exports = {
    intro,
    login,
    postLogin,
    sesion,
    deleteSesion,
}