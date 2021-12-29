/**
 * @overview Bulb entitity
 */


/** Grabs code using require() to grab modules
 *  @param {String} User.js User file
 *  @param {String} Orb.js Orb file
 *  @param Integration.js Integration file
 */
let User = require('./User'),
    Orb = require('./Orb'),
    Integration = require('./Integration');

/**
 * Holds and obtains information about Bulb
 * @name Bulb
 * @type {Variable}
 */
var Bulb = {
    tableName: 'orb-server_bulbs',

    /** Stores User as owner of the bulb in tableName
     * @property {function} owner
     * @return {Boolean} Creates a one to one association in table
     * */
    owner: function() {
        return this.belongsTo('User', 'owner');
    },

    /** Stores Orb as the orb in tableName
     * @property {function} orb
     * @return {Boolean} Creates a one to one association in table
     * */
    orb: function() {
        return this.belongsTo('Orb', 'orb');
    },

    /** Stores Integration as the integration in tableName
     * @property {function} integration
     * @return {Boolean} Creates a one to one association in table
     * */
    integration: function() {
        return this.belongsTo('Integration', 'integration');
    },

    /** Gets and stores the proper bulb intensity
     * @property {Function} validate Checks and sets bulbs intensity
     * @return {Promise} Resolves on success, rejects on error
     */
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

// Exports Bulb Variable to be used in other files
module.exports = Bulb;
