/**
 * @overview Orb entitiy
 */

let Bookshelf = require('./base');

let User = require('./user')
    Meter = require('./meter'),
    Bulb = require('./bulb');


var Orb = Bookshelf.Model.extend({
    tableName: 'orb-server_orbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    bulbs: function() {
        return this.hasMany('Bulb', 'orb');
    },

    meter1: function() {
        return this.hasOne('Meter', 'id');
    },

    meter2: function() {
        return this.hasOne('Meter', 'id');
    },

    validate: function() {
        let title = this.get('title');

        let errors = {};

        if(title.length > 150) {
            errors.title = ['Title too long. 150 characters maximum.'];
        }

        if (Object.keys(errors).length !== 0) {
            return Promise.resolve(errors);
        } else {
            return Promise.resolve();
        }
    }
});

module.exports = Orb;
