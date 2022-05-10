const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db/database.sqlite'
    },
    useNullAsDefault: true,
    pool: {min: 0, max: 10},
});

module.exports = { knex };