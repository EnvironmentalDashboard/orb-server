/**
 * @overview Connects application to database
 */

 var Bookshelf = null;

 module.exports = function (config) {
     if (Bookshelf) {
         return Bookshelf;
     }

     var knex = require('knex')({
         client: 'mysql',
         connection: config
     });

     Bookshelf = require('bookshelf')(knex);

   return Bookshelf;
 };
