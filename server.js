const routesProductos = require('./src/routes/routesProductos.js');
const routesUsuarios = require('./src/routes/routesUsuarios.js');

const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 8080;

app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
    secret: 'aldair',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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


// Productos
app.get('/', routesUsuarios.intro);
app.get('/login', routesUsuarios.login);
app.post('/login', routesUsuarios.postLogin);

function checkLogged(req, res, next) {
    if (req.session?.logged) {
        return next();
    }
    return res.render('error-content', { title: 'No tienes permiso para ver esta página' });
}

app.get('/profile', routesUsuarios.sesion);
app.get('/profile/:username', routesUsuarios.deleteSesion);

app.get('/add-producto', checkLogged, routesProductos.formProducto);
app.post('/add-producto', checkLogged, routesProductos.postProducto);

app.get('/productos', checkLogged, routesProductos.allProductos);
app.get('/productos/:id', checkLogged, routesProductos.detailProducto);
app.get('/productos/:id/update', checkLogged, routesProductos.updateProducto);
app.post('/productos/:id/update', checkLogged, routesProductos.putProducto);
app.get('/productos/:id/delete', checkLogged, routesProductos.deleteProducto);


// Usuarios
// app.get('/usuarios', (req,res) => routesUsuarios.usuarios);



const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
server.on('error', (err) => console.log(err));