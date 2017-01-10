/**
 * @overview Responsible for dashboard services (dashboard generation)
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi');

let generateOrbList = function(user) {
    return Entity.Orb.collection().query('where', 'owner', '=', user.id).fetch().then(function (results) {
        let orbList = [];

        results.forEach(function (orb) {
            orbList.push({
                id: orb.get('id'),
                title: orb.get('title')
            });
        });

        return orbList;
    });
};

let generateBulbList = function(user, cache) {
    let listFromAPIPromise = new Entity.User({id: user.id}).fetch().then(function(client){
        if (client.get('token') == null || client.get('token') == '') {
            return Promise.reject('This account isn\'t authorized with a LifX account. Please authorize to link your accounts.');
        }

        return LifxBulbAPI.getBulbList(client.get('token')).catch(function() {
            return Promise.reject('The access token associated with your account went bad. Please reauthorize to link your accounts.');
        });
    }).catch(function (reason) {
        return Promise.reject(reason);
    });

    let bulbCollectionPromise = Entity.Bulb.collection().query('where', 'owner', '=', user.id).fetch({withRelated: ['orb']});


    let bulbList = {};
    return bulbCollectionPromise.then(function (bulbCollection) {

        bulbCollection.forEach(function (bulb) {
            bulbList[bulb.get('selector')] = {info: null, config: bulb};
        });

        return listFromAPIPromise.then(function (bulbsFromAPI) {
            console.log(bulbsFromAPI);
            JSON.parse(bulbsFromAPI).forEach(function (bulb) {
                if (!bulbList[bulb.id]) {
                    bulbList[bulb.id] = {config: null}
                }

                bulbList[bulb.id].info = bulb;
            });

            return bulbList;

        }).catch(function (reason) {
            cache.set("authorization-notice", reason);
            return {};
        });
    });

};

let Dashboard = {

    initializeDashboard: function(reqCache, sess, done) {
        let client = Recognition.knowsClient(sess, reqCache);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        /**
         * Get all orbs related to this user
         */
        let orbListPromise = generateOrbList(client);

         /**
          * Get all bulbs related to this user
          */
        let bulbListPromise = generateBulbList(client, reqCache);

        Promise.all([orbListPromise, bulbListPromise]).then(function (val) {
            reqCache.set('orb-list', val[0]);
            reqCache.set('bulb-list', val[1]);

            return done();
        });
    }
};

module.exports = Dashboard;
