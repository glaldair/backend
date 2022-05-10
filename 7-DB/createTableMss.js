const { knex } = require('./options/SQLite3');

const createTableMss = async (config, name) => {
    await knex.schema.createTable(name, table => {
        table.string('name').notNullable();
        table.string('timestamp').notNullable();
        table.float('message').notNullable();
    }).then(() => console.log('Tabla creada')).catch(err => console.log(err));
}

module.exports = { createTableMss };