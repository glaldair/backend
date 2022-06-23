const Productos = require('../models/Productos.js');
    const productos = new Productos('productos');

function formProducto (req, res) {
    res.render('add-producto');
}
async function postProducto (req, res) {
    const producto = req.body;
    if (!producto) {
        res.render('error-content', { title: 'Faltan campos por rellenar' });
    }

    await productos.addProducto(producto)
        .then(response => {
            res.render('succes-producto', { title: 'Producto agregado con éxito' });
            console.log(response);
        })
        .catch(err => {
            res.render('error-content', { title: 'Ha ocurrido un error al intentar añadir el producto' });
            console.log(err);
        });
}
async function detailProducto (req, res) {
    const id = req.params.id;
    await productos.getProducto(id)
        .then(response => {
            res.render('detail-producto', {producto: response});
        })
        .catch(err => {
            res.render('error-content', { title: 'Hubo un error en la conexión' });
            console.log(err);
        });
}
async function allProductos (req, res) {
    await productos.getProductos()
        .then(response => {
            res.render('productos', { productos: response });
        })
        .catch(err => {
            res.render('error-content', { title: 'No se pudo conectar' });
            console.log(err);
        })
}
async function updateProducto (req, res) {
    const id = req.params.id;
    await productos.getProducto(id)
        .then(response => {
            res.render('update-producto', { producto: response });
            console.log(response);
        })
        .catch(err => {
            res.render('error-content', { title: 'Hubo un error de conexión en la base de datos' });
            console.log(err);
        })
}
async function putProducto (req, res) {
    const id = req.params.id;
    const producto = req.body;
    await productos.updateProducto(id, producto)
        .then(response => {
            res.render('succes-producto', { title: 'Producto guardado' });
            console.log(response);
        })
        .catch(err => {
            res.render('error-content', { title: 'Hubo un error de conexión en la base de dotos' });
            console.log(err);
        })
}
async function deleteProducto (req, res) {
    const id = req.params.id;
    await productos.deleteProducto(id)
        .then(response => {
            res.render('succes-producto', { title: 'Producto eliminado con éxito' });
            console.log(response);
        })
        .catch(err => {
            res.render('error-content', { title: 'No se pudo eliminar el producto' });
            console.log(err);
        })
}

module.exports = {
    formProducto,
    postProducto,
    detailProducto,
    allProductos,
    updateProducto,
    putProducto,
    deleteProducto,
}