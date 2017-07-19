/**
 * @overview Responsible for meter services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');

let Meter = {
    /**
     * Retrieves a meter
     * @param  {int} meterId Integer of meter to retrieve
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on error
     */
    retrieve: function(meterId, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.Meter({
            bos_uuid: meterId
        }).fetch({ withRelated: ['building', 'organization'] })
        .then(function(meter) {
            if(!meter) {
                return Promise.reject({ noRecord: true });
            }

            return Promise.resolve(meter);
        });
    }
};

module.exports = Meter;
