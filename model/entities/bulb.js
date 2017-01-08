/**
 * @overview User entitiy
 */

let Bookshelf = require('./base');

let User = require('./user');


var Bulb = Bookshelf.Model.extend({
    tableName: 'orb-server_bulbs',
    owner: function() {
        return this.belongsTo(User, 'owner');
    }
});

module.exports = Bulb;
