/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');


var Orb = Bookshelf.Model.extend({
    tableName: 'orb-server_orbs'
});

module.exports = Orb;
