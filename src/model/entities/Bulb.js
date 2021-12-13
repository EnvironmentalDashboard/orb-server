/**
 * @overview Bulb entitiy
 */

/** Grabs code from User.js, Orb.js, and Integration.js for file **/
/** Uses require to grab the module **/
let User = require('./User'),
    Orb = require('./Orb'),
    Integration = require('./Integration');

/**
 * Creates Object Bulb:
     * Creates tables called 'orb-server_bulbs' with information:
     *      - owner
     *      - orb
     *      - integration
     *      - validate
 * Function belongTo: creates a one-to-one association between target and item. Used in this case for
 * association for item to column in table
**/
var Bulb = {
    tableName: 'orb-server_bulbs',

    // Stores User as owner of the bulb in tableName
    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    // Stores Orb as the orb in tableName
    orb: function() {
        return this.belongsTo('Orb', 'orb');
    },

    // Stores Integration as the integration in tableName
    integration: function() {
        return this.belongsTo('Integration', 'integration');
    },

    //
    validate: function() {
        // Stores the pulse intensity and brightness of the bulb
        let pulse_intensity = this.get('pulse_intensity'),
            brightness = this.get('brightness');

        // Checks if the bulb intensity is false, if the value is Not-A-Number (through the method isNaN()), or
        // if the pulse intensity is not between the values 0 and 1
        // If any conditions are met, set intensity to .2
        if(!pulse_intensity || isNaN(pulse_intensity) || pulse_intensity < 0 || pulse_intensity > 1) {
            this.attributes.pulse_intensity = .2;
        }

        // Does similar checks as bulb intensity but for brightness
        // If any of the conditions are met, set brightness to .6
        if(!brightness || isNaN(brightness) || brightness < 0 || brightness > 1) {
            this.attributes.brightness = .6;
        }

        // Returns the promise value of the promise value of the Promise Object
        // Creates a new promise that is immediately resolved, which results in an initial result of nothing
        // This is the same as using Promise.resolve(undefined)
        return Promise.resolve();
    }
};

module.exports = Bulb;
