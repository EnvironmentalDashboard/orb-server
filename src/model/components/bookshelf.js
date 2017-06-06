/**
 * @overview Provides model layer with Bookshelf ORM
 *
 * NOTE: Database interaction should only be done through the model layer.
 *
 * Debugging : Knex crashes when server closes connections
 * - set pool min/max
 * - play with `afterCreate`
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
    },
    pool: {
        min: 5,
        max: 15,
        ping: function (conn, callback) {
            conn.query('SELECT 1', callback);
        }
    }
});

let Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('registry');

module.exports = Bookshelf;
