/**
 * @overview Responsible for user authentication
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi');

let generateOrbList = function(user, cache) {
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

let generateBulbList = function(user) {
    let listFromAPIPromise = new Entity.User({id: user.id}).fetch().then(function(){
        return LifxBulbAPI.getBulbList(user.token);
    });

    let bulbCollectionPromise = Entity.Bulb.collection().query('where', 'owner', '=', user.id).fetch();

    return Promise.all([listFromAPIPromise, bulbCollectionPromise]).then(function (val){
        let bulbsFromAPI = JSON.parse(val[0]), bulbCollection = val[1];

        let bulbList = {};

        bulbsFromAPI.forEach(function (bulb) {
            bulbList[bulb.id] = {
                info: bulb,
                config: null
            };
        });

        /**
         * Loop through all bulbs in database and remove bulbs in the database
         * from the `bulbsFromAPI` array
         */
        bulbCollection.forEach(function(bulb) {
            if (!bulbList[bulb.get('selector')]) {
                bulbList[bulb.get('selector')] = {info: null};
            }

            bulbList[bulb.get('selector')].config = bulb;
        });

        return bulbList;
    });
};

let Dashboard = {

    initializeDashboard: function(reqCache, sess, done) {
        let client = Recognition.knowsClient(sess);

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
        let bulbListPromise = generateBulbList(client);

        Promise.all([orbListPromise, bulbListPromise]).then(function (val) {
            reqCache.set('orb-list', val[0]);
            reqCache.set('bulb-list', val[1]);

            return done();
        });
    }
};

module.exports = Dashboard;
