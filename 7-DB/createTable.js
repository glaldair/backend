const { knex } = require('./options/mariaDB');

const createTable = async (config, name) => {
    await knex.schema.withSchema('yajid_products').createTable(name, table => {
        table.integer('id').primary();
        table.string('name').notNullable();
        table.string('timestamp').notNullable();
        table.float('price').notNullable();
        table.string('image').notNullable();
        table.string('description').notNullable();
        table.string('details').notNullable();
        table.string('code').notNullable();
        table.integer('stock').notNullable();
        table.string('category').notNullable();
        table.string('subcategory').notNullable();
        table.string('status').notNullable();
    }).then(() => console.log('Tabla creada')).catch(err => console.log(err));
}

module.exports = { createTable };