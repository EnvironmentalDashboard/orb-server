/**
 * @overview Bulb entitiy
 */

let User = require('./User'),
    Orb = require('./Orb'),
    Integration = require('./Integration');


var Bulb = {
    tableName: 'orb-server_bulbs',

    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    orb: function() {
        return this.belongsTo('Orb', 'orb');
    },

    integration: function() {
        return this.belongsTo('Integration', 'integration');
    },

    validate: function() {
        let pulse_intensity = this.get('pulse_intensity'),
            brightness = this.get('brightness');

        if(!pulse_intensity || isNaN(pulse_intensity) || pulse_intensity < 0 || pulse_intensity > 1) {
            this.attributes.pulse_intensity = .2;
        }

        if(!brightness || isNaN(brightness) || brightness < 0 || brightness > 1) {
            this.attributes.brightness = .6;
        }

        return Promise.resolve();
    }
};

module.exports = Bulb;
