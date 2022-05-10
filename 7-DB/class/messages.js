const { knex } = require('../options/SQLite3');
const { createTableMss } = require('../createTableMss');
const { insertMss } = require('../insertMss');
const { User } = require('./user');

class Message {
    constructor(name) {
        this.name = name;
    }

    async insert(obj) {
        const newuser = new User(
            obj.name,
            obj.message,
        );
        insertMss(this.name, newuser);
        return newuser;
    }

    async getAll() {
        let json = await this.leerArchivo();
        return json;
    }

    async guardarArchivo() {
        const existe = await knex.schema.hasTable(this.name);
        if (!existe) {
            createTableMss(knex,this.name);
        }
    }
    
    async leerArchivo() {
        let json = await knex.select('*').from(this.name);
        return json;
    }
}

module.exports = { Message };