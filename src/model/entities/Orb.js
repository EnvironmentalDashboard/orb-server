/**
 * @overview Orb entitiy
 */

let User = require('./User'),
    RelativeValue = require('./RelativeValue'),
    Bulb = require('./Bulb');


var Orb = {
    tableName: 'orb-server_orbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    bulbs: function() {
        return this.hasMany('Bulb', 'orb');
    },

    relativeValue1: function() {
        return this.belongsTo('RelativeValue', 'relativeValue1Id');
    },

    relativeValue2: function() {
        return this.belongsTo('RelativeValue', 'relativeValue2Id');
    },

    validate: function() {
        let title = this.get('title'),
            colorScheme1 = this.get('colorScheme1'),
            colorScheme2 = this.get('colorScheme2');

        let errors = {};

        if (title.length > 150) {
            errors.title = ['Title too long. 150 characters maximum.'];
        }

        if(colorScheme1 == colorScheme2) {
            errors.meter1 = ['Color scheme must be different from meter 2\'s color scheme.'];
            errors.meter2 = ['Color scheme must be different from meter 1\'s color scheme.'];
        }

        if(colorScheme1 != 0 && colorScheme1 != 1 && colorScheme1) {
            if(!("meter1" in errors) || !Array.isArray(errors.meter1)) {
                errors.meter1 = [];
            }

            errors.meter1.push('Invalid color scheme value.');
        }

        if(colorScheme2 != 0 && colorScheme2 != 1 && colorScheme2) {
            if(!("meter2" in errors) || !Array.isArray(errors.meter2)) {
                errors.meter2 = [];
            }

            errors.meter2.push('Invalid color scheme value.');
        }

        if (Object.keys(errors).length !== 0) {
            return Promise.resolve(errors);
        } else {
            return Promise.resolve();
        }
    }
};

module.exports = Orb;
