const { knex } = require('../options/mariaDB');
const { createTable } = require('../createTable');
const { insert } = require('../insert');

class Container {
    constructor(name) {
        this.name = name;
    }

    async saveProduct(product) {
        // Comprobar si el producto existe por su id
        const productExist = await knex.select('id').from(this.name).where('id', product.id);
        if (productExist.length > 0) {
            // Si existe, cancelar la operación
            return { error: 'id ya existe' };
        }
        // Guardar el producto
        insert(this.name, product);
        return { success: 'producto guardado' };
    }

    async getProductById(id) {
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == id);
        if (!obj) {
            return { error: 'producto no encontrado' };
        }
        return obj;
    }

    async getAll() {
        let json = await this.leerArchivo();
        return json;
    }

    async deleteById(id) {
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == id);
        if (!obj) {
            return { error: 'producto no encontrado' };
        }
        await knex(this.name).where('id', id).del();
        return {success: 'producto eliminado'};
    }

    async updateById(id, product) {
        let json = await this.leerArchivo();
        let obj = json.find(obj => obj.id == id);
        if (!obj) {
            return { error: 'producto no encontrado' };
        }
        await knex(this.name).where('id', id).update(product);
        return {success: 'producto actualizado'};
    }



    async guardarArchivo() {
        // Comprobar si la tabla existe
        const existe = await knex.schema.hasTable(this.name);
        if (!existe) {
            // Si no existe, crear la tabla
            await createTable(knex,this.name);
        };
    }

    async leerArchivo() {
        let json = await knex.select('*').from(this.name);
        return json;
    }
}

module.exports = { Container };