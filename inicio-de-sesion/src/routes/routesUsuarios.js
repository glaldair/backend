// const session = require('express-session');

// const Usuarios = require('../models/Usuarios.js');
//     const usuarios = new Usuarios('usuarios');
//     usuarios.guardarArchivo();

function intro (req, res) {
    if (req.isAuthenticated()) {
        const user = req.user.username;
        res.render('ok-login', { title: `Hola ${user}` });
    } else {
        res.render('intro')
    }
}
function signup (req, res) {
    res.render('signup');
}
async function postSignup (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.redirect('login');
    }
}
async function getFailSignup (req, res) {
    res.render('error-content', { title: 'Error al registrarse, intente de nuevo más tarde' });
}


function login (req, res) {
    res.render('login');
}
async function postLogin (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login');
    }
}
async function getFailLogin (req, res) {
    // res.render('error-content', { title: 'Error al iniciar sesión, intente de nuevo más tarde' });
}


async function deleteSesion(req, res){
    req.logout( (err) => {
        if (!err) {
            res.render('intro');
        } 
    });
}

async function profile (req, res) {
    if (req.isAuthenticated()) {
        let user = req.user.username;
        res.render('profile', { name: user });
    } else {
        res.redirect('login');
    }
}

async function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = {
    intro,
    login,
    postLogin,
    getFailLogin,
    signup,
    postSignup,
    getFailSignup,
    deleteSesion,
    profile,
    checkAuth
}