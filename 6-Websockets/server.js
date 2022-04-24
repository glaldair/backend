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
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const router = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(express.static('public'));

// Crear una pagina en tiempo real que muestre los productos almacenados en el archivo con socket.io.


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

router.get('/productos', async (req, res) => {
    let json = await apiProductos.getAll();
    res.json(json);
});

router.post('/productos', async (req, res) => {
    let producto = await apiProductos.save(req.body);
    res.json(producto);

    // Enviar el producto al cliente
    io.emit('productos', await apiProductos.getAll());
});

io.on('connection', (socket) => {
    console.log('Conexión establecida');
    
    const productos = apiProductos.getAll();
    
    productos.then(data => {
        // Enviar los productos al cliente
        socket.emit('productos', data);
    });
});


const messages = [];

io.on('connection', (socket) => {
    console.log('New user connected');

    // Enviar los mensajes al cliente
    socket.emit('messages', messages);

    socket.on('new-message', (data) => {
        // Guardar el mensaje en el array
        messages.push(data);
        // Enviar el mensaje al cliente
        io.sockets.emit('messages', messages);
    });
});

const serverConection = httpServer.listen(8080, () => console.log('Servidor corriendo en el puerto 8080'));
serverConection.on('error', err => console.log('hubo un error', err));