/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let User = Bookshelf.Model.extend({
    tableName: 'orb-server_users'
});

module.exports = User;
