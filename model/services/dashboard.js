/**
 * @overview Responsible for user authentication
 */

let Entity = require('../entities'),
    Recognition = require('./recognition');

let Dashboard = {

    create: function(reqCache, sess, done) {
        if (!Recognition.knowsClient(sess)) {
            reqCache.set('auth-error', true);
            return done();
        }

        return done();
    }
};

module.exports = Dashboard;
