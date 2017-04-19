/**
 * @overview Responsible for orb instruction dispatching services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    BulbAPIIntegrations = require('./BulbAPIIntegrations'),
    OrbEmulator = require('./OrbEmulator');

let OrbInstructionsDispatcher = {

    /**
     * Goes through all enabled bulbs and dispatches instructions
     */
    dispatchAll: function() {
        let me = this;

        Entity.Bulb.collection().query('where', 'enabled', '=', '1').fetch({
            withRelated: ['orb', 'owner', 'integration']
        }).then(function(bulbs) {
            bulbs.forEach(function(bulb) {
                let integration = bulb.related('integration'),
                    BulbAPI = BulbAPIIntegrations[integration.get('type')];

                /**
                 * Determine which meter to display
                 *
                 * By default, use meter 1. If meter 2 exists, calculate whether
                 * to show meter 1 or meter 2 based on the time
                 */
                bulb.related('orb').related('relativeValue2').fetch().then(function(relativeValue2) {
                    let meterId = relativeValue2.get('meter_uuid'),
                        meter = 1;

                    if(!!meterId) {
                        /**
                         * If relative value 2's meter exists:
                         * Calculate which meter to display. Every 20 seconds, this changes.
                         * Take the timestamp in ms and divide by 1000ms/1s, then divide by
                         * 20s. Floor this value (|0), mod 2 and add 1.
                         */
                        meter = ((+new Date() / 20000 | 0) % 2) + 1;
                    }

                    return OrbEmulator.emulate(bulb.relations.orb, meter);
                }).then(function(instruction) {
                    let packet = {
                        from_color: 'hue:' + instruction.hue + ' brightness:.6 saturation:1',
                        color: 'hue:' + instruction.hue + ' brightness:.3 saturation:1',
                        period: 1 / instruction.frequency,
                        cycles: 40 * instruction.frequency
                    };

                    let selector = 'id:' + bulb.get('selector');

                    return BulbAPI.breathe(packet, selector, integration.get('token'))
                }).then(function(response) {
                    /**
                     * Interpret response instructions
                     */
                    let responsePromises = [];

                    if (response.instructions.integration) {
                        integration.set(response.instructions.integration);
                        responsePromises.push(integration.save());
                    }

                    if(response.instructions.bulb) {
                        bulb.set(response.instructions.bulb);
                        responsePromises.push(bulb.save());
                    }

                    return Promise.all(responsePromises);
                });

            });
        }).catch(console.log.bind(console));
    }
};

module.exports = OrbInstructionsDispatcher;
