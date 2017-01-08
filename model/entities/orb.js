/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let User = require('./user');


var Orb = Bookshelf.Model.extend({
    tableName: 'orb-server_orbs',
    owner: function() {
        return this.belongsTo(User, 'owner');
    },
    bulbs: function() {
        return this.hasMany(Bulb, 'id');
    }
});

module.exports = Orb;
