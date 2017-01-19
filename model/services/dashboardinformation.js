/**
 * @overview Responsible for dashboard services (dashboard generation)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi'),
    Orb = require('./orb');


let DashboardInformation = {

    /**
     * Stores a list of orbs associated with authenticated user to inputted cache
     * @param  {Object} reqCache Cache object to write to
     * @param  {Object} sess     Persisting sssion object
     * @return {Promise}         A promise
     */
    initializeOrbList: function(reqCache, sess) {
        client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        /**
         * Query for a collection of all orbs related to authenticated client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (results) {
            let orbList = [];

            /**
             * Loop through each orb and store it in orbList
             */
            results.forEach(function (orb) {
                orbList.push({
                    id: orb.get('id'),
                    title: orb.get('title')
                });
            });

            /**
             * Store the orb list to cache and resolve
             */
            reqCache.set('orb-list', orbList);
            return Promise.resolve();
        });
    },

    initializeOrb: function(orbId, reqCache, sess) {
        client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        return new Entity.Orb({
            id: orbId,
            owner: client.id
        }).fetch().then(function (orb) {
            if(!orb) {
                // @TODO validation
                Promise.resolve();
            }

            reqCache.set('orb-info', orb.attributes);
            return Promise.resolve();
        });
    },

    /**
     * Stores a list of orbs associated with authenticated user merged with orbs
     * pulled from the API to inputted cache
     * @param  {Object} reqCache Cache object to write to
     * @param  {Object} sess     Persisting sssion object
     * @return {Promise}         A promise
     */
    initializeBulbList: function(reqCache, sess) {
        client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        let bulbList = {}, updatedClient;

        /**
         * Query for all the bulbs stored in the database associated with the
         * client
         */
        return Entity.Bulb.collection().query('where', 'owner', '=', client.id)
                .fetch({withRelated: ['orb']}).then(function (bulbCollection) {
            /**
             * If bulbCollection is empty/falsey, skip this step
             */
            if (!bulbCollection) {
                return Promise.resolve();
            }

            /**
             * Add all the bulbs recieved from the API to the bulb list
             *
             * NOTE the key we use is the bulb's selector for easy merging in
             * the next then() in this chain
             */
            bulbCollection.forEach(function (bulb) {
                bulbList[bulb.get('selector')] = {info: null, config: bulb};
            });

            /**
             * Fetch an updated instance of the client
             * @TODO Maybe there should be an updateCertifiedClient service
             */
            return new Entity.User({id: client.id}).fetch();
        }).then(function (user) {
            updatedClient = user;

            /**
             * If the client's token is empty/null then they haven't tried to
             * authorize their account with LifX
             */
            if (user.get('token') == null || user.get('token') === '') {
                reqCache.set('authorization-notice', 'This account isn\'t authorized with a LifX account. Please authorize to link your accounts.');
                return Promise.resolve({authorizationNotice: true});
            }

            return LifxBulbAPI.getBulbList(updatedClient.get('token'));
        }).then(function (bulbsFromAPI) {
            /**
             * If the promise from the LifxBulbAPI service wasn't empty and there's
             * no auth notice, merge the bulbs from the API with the bulb list
             */
            if(bulbsFromAPI && !bulbsFromAPI.authorizationNotice) {
                JSON.parse(bulbsFromAPI).forEach(function (bulb) {
                    if(!bulbList[bulb.id]) {
                        bulbList[bulb.id] = {config: null};
                    }

                    bulbList[bulb.id].info = bulb;
                });
            }

            /**
             * The bulb list is finalized now; store it to cache & resolve
             */
            reqCache.set('bulb-list', bulbList);
            return Promise.resolve();
        }).catch(function(reason) {
            /**
             * If there was an exception, set a generic authorization notice &
             * resolve
             */
            reqCache.set('authorization-notice', 'The access token associated with your account went bad. Please reauthorize to link your accounts.');
            return Promise.resolve();
        });

    },

    /**
     * Stores a list of meters associated with authenticated user merged with orbs
     * pulled from the API to inputted cache
     * @param  {Object} reqCache Cache object to write to
     * @param  {Object} sess     Persisting sssion object
     * @return {Promise}         A promise
     */
    initializeMeterList: function (reqCache, sess) {
        if (!Recognition.knowsClient(sess, reqCache)) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        /**
         * Get all the meters in the database
         */
        return Entity.Meter.collection().fetch({withRelated: ['building']}).then(function (results) {
            let meterList = {};

            results.forEach(function (meter) {
                /**
                 * Assign meters to the meter list with the building name as the
                 * key
                 */
                if (!meterList[meter.relations.building.get('name')]) {
                    meterList[meter.relations.building.get('name')] = [];
                }

                meterList[meter.relations.building.get('name')].push({
                    name: meter.get('name'),
                    id: meter.get('id')
                });
            });

            reqCache.set('meter-list', meterList);
            return Promise.resolve();
        });
    },

    /**
     * Stores a list of orb instructions associted with authenticated user to the
     * inputted cache
     * @param  {Object} reqCache Cache object to write to
     * @param  {Object} sess     Persisting session object
     * @return {Promise}         A promise
     */
    initializeOrbInstructionsList: function(reqCache, sess) {
        if (!Recognition.knowsClient(sess, reqCache)) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        /**
         * Query for a collection of all orbs associated with the recognized
         * client
         */
        return Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (orbs) {
            /**
             * Stores promises of relative usage calculation
             * @type {Array}
             */
            let relativeUsagePromises = [];

            /**
             * Associates an orb and meter with entries w/ same key in
             * `relativeUsagePromises`
             * @type {Array}
             */
            let keyToOrb = [];

            let instructions = {};

            orbs.forEach(function (orb) {
                relativeUsagePromises.push(Orb.emulate(orb, 1));
                relativeUsagePromises.push(Orb.emulate(orb, 2));

                keyToOrb.push({orb: orb, meter: 1});
                keyToOrb.push({orb: orb, meter: 2});
            });

            return Promise.all(relativeUsagePromises).then(function (instructionsReturned) {
                instructionsReturned.forEach(function(instruction, key){
                    let orbId = keyToOrb[key].orb.get('id'),
                        meter = keyToOrb[key].meter;

                    if (!instructions[orbId]) {
                        instructions[orbId] = {meters: []};
                    }

                    instructions[orbId].meters[meter] = instruction;
                });

                return instructions;
            });

        }).then(function (list) {
            reqCache.set('orb-instruction-list', list);
            return Promise.resolve();
        });
    }
};

module.exports = DashboardInformation;
