/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let Orb = require('./orb');

let User = Bookshelf.Model.extend({
    tableName: 'orb-server_users',
    orbs: function() {
        return this.hasMany(Orb, 'id');
    }
});

module.exports = User;
