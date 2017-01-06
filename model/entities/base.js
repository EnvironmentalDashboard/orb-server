/**
 * @overview Provides model layer with Bookshelf ORM
 *
 * NOTE: Database interaction should only be done through the model layer.
 */


 let dbconnect = require('../../lib/dbconnect'); // Bookshelf

module.exports = dbconnect;
