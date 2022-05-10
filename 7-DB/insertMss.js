const { knex } = require('./options/SQLite3');

const insertMss = (table,obj) => {
    knex(table).insert({
        name: obj.name,
        timestamp: obj.timestamp,
        message: obj.message
    }).then(() => console.log('Mensaje insertado')).catch(err => console.log(err));
}

module.exports = { insertMss };