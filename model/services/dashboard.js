/**
 * @overview Responsible for user authentication
 */

let Entity = require('../entities'),
    Recognition = require('./recognition');

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
         Entity.Orb.collection().query('where', 'owner', '=', client.id).fetch().then(function (results) {
             let orbList = [];

             results.forEach(function (orb) {
                 orbList.push({
                    id: orb.get('id'),
                    title: orb.get('title')
                 });
             });

             reqCache.set('orb-list', orbList);
             return done();
         });
    }
};

module.exports = Dashboard;
