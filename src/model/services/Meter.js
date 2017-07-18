/**
 * @overview Responsible for orb services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let Meter = {
    retrieve: function(meterId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.Meter({
            bos_uuid: meterId
        }).fetch().then(function(meter) {
            if(!meter) {
                return Promise.reject({ noRecord: true });
            }
            
            return Promise.resolve(meter);
        });
    }
};

module.exports = Meter;
