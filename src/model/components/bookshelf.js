/**
 * @overview Provides model layer with Bookshelf ORM
 *
 * NOTE: Database interaction should only be done through the model layer.
 */

let knex = require('knex')({
    client: 'mysql',
    connection: {
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "user": process.env.DB_USER,
        "password": process.env.DB_PWD,
        "database": process.env.DB_NAME,
        "charset": process.env.DB_ENCODING
    }
});

let Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('registry');

module.exports = Bookshelf;
