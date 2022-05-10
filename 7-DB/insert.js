const { knex } = require('./options/mariaDB');

const insert = (table,obj) => {
    knex(table).insert({
        id: obj.id,
        name: obj.name,
        timestamp: obj.timestamp,
        price: obj.price,
        image: obj.image,
        description: obj.description,
        details: obj.details,
        code: obj.code,
        stock: obj.stock,
        category: obj.category,
        subcategory: obj.subcategory,
        status: obj.status
    }).then(() => console.log('Producto insertado')).catch(err => console.log(err));
}

module.exports = { insert };