/**
 * @overview Responsible for user recognition
 */

let sodium = require('sodium').api;

let Entity = require('../entities');

let Recognition = {

    certifyClient: function(user, sess) {
        sess.authenticatedUser = user;
    },

    knowsClient: function(sess) {
        return sess.authenticatedUser || false;
    },

    login: function(params, reqCache, sess, done) {

        /**
         * Need to keep track of errors
         * @type {Object}
         */
        let errors = {};

        /**
         * Set a resolve function to store the errors in the request cache
         * before calling the done callback, only if there are errors.
         */
        let resolve = function() {
            if(Object.keys(errors).length !== 0) {
                reqCache.set('errors', errors);
            }
            done();
        }

        new Entity.User({email: params.email}).fetch().then(function (match) {
            if (match) {
                let pwdHash = Buffer.from(match.get('password')),
                    pwdBuffer = Buffer.from(params.password);

                if (sodium.crypto_pwhash_argon2i_str_verify(pwdHash, pwdBuffer)) {
                    /**
                     * Certify the client if argon2i certifies the hash w/ the
                     * entered password
                     */

                    Recognition.certifyClient(match, sess);
                    return resolve();
                }
            }

            /**
             * There wasn't a match or this thread is still going because the
             * client failed to authenticate
             */
            errors.login = ['Credentials did not authenticate. Please try again.'];
            return resolve();
        });

    }

};

module.exports = Recognition;
