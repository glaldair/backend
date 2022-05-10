const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'yajid_products',
    },
    pool: {min: 0, max: 10}
});

module.exports = { knex };