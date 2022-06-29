const routesProductos = require('./src/routes/routesProductos.js');
const routesUsuarios = require('./src/routes/routesUsuarios.js');
const UserModel = require('./src/models/Usuarios.js');
const { createHash } = require('./src/utils/hashGenerator.js');
const { passValidator } = require('./src/utils/passValidator.js');

const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = 8080;

app.use(session({
    secret: 'aldair',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 100000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())
app.use(passport.session())

app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/src/views/layouts",
        partialsDir: __dirname + "/src/views/partials/",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
);

app.set('view engine', 'hbs');
app.set('views', './src/views');
app.use(express.static(__dirname + "/public"));



passport.use('login', new LocalStrategy ( (username, password, callback) => {
        UserModel.findOne({ username: username}, (err, user) => {
            if (err) {
                return callback(err);
            }

            if (!user) {
                console.log('No se encontró el usuario');
                return callback(null, false);
            }

            if (!passValidator(user, password)) {
                console.log('Contraseña incorrecta');
                return callback(null, false);
            }

            return callback(null, user);
        })
    }
))


passport.use('signup', new LocalStrategy(
    {passReqToCallback: true}, (req, username, password, callback) => {
        UserModel.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('Hay un error al registrarse');
                return callback(err);
            }

            if (user) {
                console.log('El usuario ya existe');
                return callback(null, false);
            }

            console.log(req.body);

            const newUser = {
                username: username,
                password: createHash(password),
                email: req.body.email
            }

            console.log(newUser);

            UserModel.create(newUser, (err, userWithId) => {
                if (err) {
                    console.log('Hubo un error al registrarse');
                    return callback(err);
                }

                console.log(userWithId);
                console.log('Registro exitoso');
                return callback(null, userWithId);
            });
        });
    }
))


passport.serializeUser((user, callback) => {
    callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
    UserModel.findById(id, callback);
});


// Index
app.get('/', routesUsuarios.intro);

// Iniciar sesion
app.get('/login', routesUsuarios.login);
app.post('/login', passport.authenticate('login', { failureRedirect: '/fail-login' }), routesUsuarios.postLogin);
app.get('/fail-login', routesUsuarios.getFailLogin);

// Crear cuenta
app.get('/signup', routesUsuarios.signup);
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/fail-signup' }), routesUsuarios.postSignup);
app.get('/fail-signup', routesUsuarios.getFailSignup);

// Deslogearse
app.get('/logout', routesUsuarios.deleteSesion);

app.get('/profile', routesUsuarios.profile);

app.get('/add-producto', routesUsuarios.checkAuth, routesProductos.formProducto);
app.post('/add-producto', routesUsuarios.checkAuth, routesProductos.postProducto);

app.get('/productos', routesUsuarios.checkAuth, routesProductos.allProductos);
app.get('/productos/:id', routesUsuarios.checkAuth, routesProductos.detailProducto);
app.get('/productos/:id/update', routesUsuarios.checkAuth, routesProductos.updateProducto);
app.post('/productos/:id/update', routesUsuarios.checkAuth, routesProductos.putProducto);
app.get('/productos/:id/delete', routesUsuarios.checkAuth, routesProductos.deleteProducto);


// Usuarios
// app.get('/usuarios', (req,res) => routesUsuarios.usuarios);



const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
server.on('error', (err) => console.log(err));