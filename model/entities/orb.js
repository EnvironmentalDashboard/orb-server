/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let User = require('./user');


var Orb = Bookshelf.Model.extend({
    tableName: 'orb-server_orbs',
    owner: function() {
        return this.belongsTo(User, 'owner');
    }
});

module.exports = Orb;
