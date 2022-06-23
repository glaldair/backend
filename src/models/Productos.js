const db = require('../config/productos.js');

class Productos {
    constructor (nombre){
        this.nombre = nombre;
    }

    // addProducto (Objeto): --> Agrega un producto a la base de datos
    async addProducto (Objeto){

        // Si el id ya existe, se cancela la operacion
        const productosCollection = db.collection(this.nombre);
        const id = Objeto.id;
        const doc = productosCollection.doc(`${id}`)

        // Si el id ya existe, se cancela la operacion
        const existe = await doc.get();
        if (existe.exists) {
            return { success: false, message: "El id ya existe" };
        }

        await doc.create(Objeto);
        return Objeto;
    }

    // getProductos (): --> Obtiene todos los productos de la base de datos
    async getProductos (){
        const productosCollection = db.collection(this.nombre);
        const productos = await productosCollection.get();
        // Convertir todos los nombres a minuscula
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        }).map(producto => {
            producto.nombre = producto.nombre.toLowerCase();
            return producto;
        }).sort((a, b) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
        });
    }

    // getProducto (id): --> Obtiene un producto de la base de datos
    async getProducto (id){
        const productosCollection = db.collection(this.nombre);
        const producto = await productosCollection.doc(id).get();

        if (!producto.exists) {
            return { success: false, message: "El producto no existe" };
        }

        return { id: producto.id, ...producto.data() };
    }

    // updateProducto (id, Objeto): --> Actualiza un producto de la base de datos
    async updateProducto (id, Objeto){
        let producto = await db.collection(this.nombre).doc(id).update(Objeto);
        
        if (!producto) {
            return { success: false, message: "El producto no existe" };
        }

        return { success: true, message: "Se actualizo el producto" };
    }

    // deleteProducto (id): --> Elimina un producto de la base de datos
    async deleteProducto (id){
        let productosCollection = db.collection(this.nombre);
        let producto = await productosCollection.doc(id).get();

        if (!producto) {
            return { success: false, message: "El id no existe" };
        }

        await productosCollection.doc(id).delete();
        return { success: true, message: "Se elimino el producto" };
    }

    // addImagen (id, url): --> Agrega una imagen a un producto de la base de datos
    async addImagen (id, url){
        let producto = await db.collection(this.nombre).doc(id).update({
            imagen: admin.firestore.FieldValue.arrayUnion(url)
        });

        if (!producto) {
            return { success: false, message: "El producto no existe" };
        }

        return { success: true, message: "Se agrego la imagen" };
    }

    // deleteImagen (id, url): --> Elimina una imagen de un producto de la base de datos
    async deleteImagen (id, url){
        let producto = await db.collection(this.nombre).doc(id).update({
            imagen: admin.firestore.FieldValue.arrayRemove(url)
        });
        
        if (!producto) {
            return { success: false, message: "El producto no existe" };
        }

        return { success: true, message: "Se elimino la imagen" };
    }

    // getImagenes (id): --> Obtiene todas las imagenes de un producto de la base de datos
    async getImagenes (id){
        let producto = await db.collection(this.nombre).doc(id).get();
        return producto.data().imagen;
    }

    // getImagen (id, url): --> Obtiene una imagen de un producto de la base de datos
    async getImagen (id, url){
        let producto = await db.collection(this.nombre).doc(id).get();
        
        if (!producto.exists) {
            return { success: false, message: "El producto no existe" };
        }

        return producto.data().imagen.find(imagen => imagen === url);
    }

    // getProductosByGrupo (grupo): --> Obtiene todos los productos de un grupo de la base de datos
    async getProductosByGrupo (grupo){
        let productos = await db.collection(this.nombre).where("grupo", "==", grupo).get();

        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosByCategoria (categoria): --> Obtiene todos los productos de una categoria de la base de datos
    async getProductosByCategoria (categoria){
        let productos = await db.collection(this.nombre).where("categoria", "==", categoria).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosBySubcategoria (subcategoria): --> Obtiene todos los productos de una subcategoria de la base de datos
    async getProductosBySubcategoria (subcategoria){
        let productos = await db.collection(this.nombre).where("subcategoria", "==", subcategoria).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosByMarca (marca): --> Obtiene todos los productos de una marca de la base de datos
    async getProductosByMarca (marca){
        let productos = await db.collection(this.nombre).where("marca", "==", marca).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosByEstado (estado): --> Obtiene todos los productos de un estado de la base de datos
    async getProductosByEstado (estado){
        let productos = await db.collection(this.nombre).where("estado", "==", estado).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosByPrecioRange (precioMin, precioMax): --> Obtiene todos los productos de un precio de la base de datos
    async getProductosByPrecioRange (precioMin, precioMax){
        let productos = await db.collection(this.nombre).where("precio", ">=", precioMin).where("precio", "<=", precioMax).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }

    // getProductosByNombre (nombre): --> Obtiene todos los productos de un nombre de la base de datos
    async getProductosByNombre (nombre){
        let productos = await db.collection(this.nombre).where("nombre", "==", nombre).get();
        
        return productos.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
    }
}

module.exports = Productos;