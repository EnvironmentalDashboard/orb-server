/**
 * @overview Provides model layer with Bookshelf ORM
 *
 * NOTE: Database interaction should only be done through the model layer.
 */


 let dbconfig = require('../../config/db'),
     dbconnect = require('../../lib/dbconnect')(dbconfig); // Bookshelf

module.exports = dbconnect;
