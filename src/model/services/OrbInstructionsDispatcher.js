/**
 * @overview Responsible for orb instruction dispatching services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    LifxBulbAPI = require('./LifxBulbAPI'),
    OrbEmulator = require('./OrbEmulator');

let OrbInstructionsDispatcher = {

    /**
     * Goes through all enabled bulbs and dispatches instructions
     */
    dispatchAll: function() {
        let me = this;

        Entity.Bulb.collection().query('where', 'enabled', '=', '1').fetch({
                withRelated: ['orb', 'owner']
            })
            .then(function(bulbs) {
                bulbs.forEach(function(bulb) {
                    console.log(Math.round(+new Date/1000)+ " : " + bulb.related('owner').get('pauseUntil'));

                    /**
                     * Calculate which meter to display. Every 20 seconds, this changes.
                     * Take the timestamp in ms and divide by 1000ms/1s, then divide by
                     * 20s. Floor this value (|0), mod 2 and add 1.
                     */
                    let meter = ((+new Date() / 20000 | 0) % 2) + 1;

                    OrbEmulator.emulate(bulb.relations.orb, meter).then(function(instruction) {
                        let packet = {
                            from_color: 'hue:' + instruction.hue + ' brightness:.6 saturation:1',
                            color: 'hue:' + instruction.hue + ' brightness:.3 saturation:1',
                            period: 1 / instruction.frequency,
                            cycles: 10 * instruction.frequency
                        };

                        let selector = 'id:' + bulb.get('selector');

                        return new Entity.User({
                            id: bulb.get('owner')
                        }).fetch().then(function(owner) {
                            return LifxBulbAPI.setBreathe(packet, selector, owner.get('token')).then(function(response) {
                                /**
                                 * Interpret response instructions
                                 */
                                let responsePromises = [];

                                if (response.instructions.user) {
                                    owner.set(response.instructions.user);
                                    responsePromises.push(owner.save());
                                }

                                if(response.instructions.bulb) {
                                    bulb.set(response.instructions.bulb);
                                    responsePromises.push(bulb.save());
                                }

                                return Promise.all(responsePromises);

                            }).catch(console.log.bind(console));
                        });

                    });
                });
            })
    }
};

module.exports = OrbInstructionsDispatcher;