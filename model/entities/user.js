/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let Orb = require('./orb'),
    Bulb = require('./bulb');

let User = Bookshelf.Model.extend({
    tableName: 'orb-server_users',
    orbs: function() {
        return this.hasMany(Orb, 'id');
    },
    bulbs: function() {
        return this.hasMany(Bulb, 'id');
    }
});

module.exports = User;
