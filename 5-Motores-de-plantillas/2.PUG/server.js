const fs = require('fs');

const arrProductos = [];

class Producto {
    constructor(nombre, precio, id) {
        this.nombre = nombre;
        this.precio = parseFloat(precio).toFixed(2);
        this.id = id;
    }
}

arrProductos.push(new Producto('Leche', '2.50', 1));
arrProductos.push(new Producto('Huevos', '1.50', 2));
arrProductos.push(new Producto('Pan', '1.00', 3));
arrProductos.push(new Producto('Arroz', '3.00', 4));
arrProductos.push(new Producto('Aceite', '5.00', 5));
arrProductos.push(new Producto('Sal', '0.50', 6));
arrProductos.push(new Producto('Lavadora', '2000.00', 7));
arrProductos.push(new Producto('Televisor', '3000.00', 8));
arrProductos.push(new Producto('Celular', '1000.00', 9));
arrProductos.push(new Producto('Café', '2.00', 10));

// Crear una clase Contenedor que tenga una propiedad nombre
class Contenedor {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
    }
    // Crear métodos específicos: save, getById, getAll, deleteById.
    // save(Object): Number - Llama al archivo y guarda el objeto que recibe, devuelve el id asignado al objeto.
    async save(Object) {
        // Si el id ya existe se cancela la operación y se devuelve un objeto { error: 'id ya existe' }
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == Object.id);
        if(obj){
            return { error: 'id ya existe' };
        }
        await arrProductos.push(Object);
        await this.guardarArchivo();
        return Object;
    }
    // getById(Number): Object - Llama al archivo y devuelve el objeto con el id que recibe, o { error: 'producto no encontrado' } si no existe.
    async getById(Number){
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        return obj;
    }
    // getAll(): Array - Devuelve un array con todos los objetos almacenados en el archivo.
    async getAll() {
        let json = await this.leerArchivo();
        return json;
    }
    // deleteById(Number): Void - Llama al archivo y elimina el objeto completamente del archivo con el id que recibe.
    async deleteById(Number) {
        let json = await arrProductos;
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        let index = json.indexOf(obj);
        json.splice(index, 1);
        await this.guardarArchivo();
    }
    // Crear un método que modifique un producto por id y devuelva el objeto modificado.
    async updateById(Number, Object) {
        let json = await arrProductos;
        let obj = json.find(obj => obj.id == Number);
        if(!obj){
            return { error : 'producto no encontrado' };
        }
        let index = json.indexOf(obj);
        json[index] = Object;
        await this.guardarArchivo();
        return Object;
    }


    // Crear métodos generales: guardarArchivo, leerArchivo.
    async guardarArchivo() {
        let json = await JSON.stringify(arrProductos);
        await fs.writeFileSync(this.nombre, json);
    }
    async leerArchivo() {
        let json = await fs.readFileSync(this.nombre, 'utf-8');
        return JSON.parse(json);
    }
}

const apiProductos = new Contenedor('./productos.txt');
apiProductos.guardarArchivo();




// Crear un servidor con express en el puerto 8080 enlazando el index.html del proyecto con el servidor.
const express = require('express');
const {Router} = express;

const app = express();
const PORT = 8080;
const router = Router();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api', router);

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
    res.render('main.pug');
})

app.get('/productos', async(req, res) => {
    res.render('productos.pug', {productos: await apiProductos.getAll()});
})

router.get('/productos', async (req, res) => {
    res.json(await apiProductos.getAll());
})
router.post('/productos', async (req, res) => {
    let id = await apiProductos.save(req.body);
    // Si la operación fue exitosa, redirigir a la página de productos.
    if(id.id){
        res.redirect('/productos');
    }
})

const server = app.listen(PORT, () => console.log('Servidor corriendo en el puerto ' + PORT));
server.on('error', (err) => console.log(err));