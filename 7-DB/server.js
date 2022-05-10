'use strict';
const { Product } = require('./class/product');
const { Container } = require('./class/container');
const { Message } = require('./class/messages');

const productosDB = new Container('productos');
productosDB.guardarArchivo();

const messagesDB = new Message('mensajes__db');
messagesDB.guardarArchivo();

const express = require('express');
const handlebars = require('express-handlebars');
const { Router } = express;
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const PORT = 3030;
const router = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('main');
})

app.get('/productos', async (req, res) => {
    const productos = await productosDB.getAll();
    res.render('products', {products: productos});
})

app.get('/formulario', (req, res) => {
    res.render('form', {url: '/api/productos'});
})


router.get('/productos/:id?', async (req, res) => {
    let id = req.params.id;
    if (id) {
        const producto = await productosDB.getProductById(id);
        res.json(producto);
    } else {
        const productos = await productosDB.getAll();
        res.json(productos);
    }
});

router.post('/productos', async (req, res) => {
    const product = new Product(
        req.body.id,
        req.body.name,
        req.body.price,
        req.body.image,
        req.body.description,
        req.body.details,
        req.body.code,
        req.body.stock,
        req.body.category,
        req.body.subcategory,
        req.body.status
    );
    const result = await productosDB.saveProduct(product);
    res.json(result);
})

router.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const product = new Product(
        req.body.id,
        req.body.name,
        req.body.price,
        req.body.image,
        req.body.description,
        req.body.details,
        req.body.code,
        req.body.stock,
        req.body.category,
        req.body.subcategory,
        req.body.status
    );
    const result = await productosDB.updateById(id, product);
    res.json(result);
})

router.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const result = await productosDB.deleteById(id);
    res.json(result);
})

io.on('connection', socket => {
    console.log('Conexion establecida con el chat');

    new Promise((resolve, reject) => {
        resolve(messagesDB.getAll());
    }).then(data => {
        socket.emit('messages', data);

        socket.on('new-message', (data) => {
            messagesDB.insert(data);
            messagesDB.guardarArchivo();
            io.sockets.emit('messages', messagesDB.getAll());
        });
    }).catch(err => {
        console.log(err);
    });
});
        

const serverConection = httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
serverConection.on('error', (err) => console.log('Error: ', err));