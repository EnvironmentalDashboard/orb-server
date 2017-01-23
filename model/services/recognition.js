/**
 * @overview Responsible for user recognition
 */

let sodium = require('sodium').api;

let Entity = require('../entities');

let Recognition = {

    certifyClient: function(user, sess) {
        sess.authenticatedUser = user;
    },

    /**
     * Returns the authenticated client's account information or false if the
     * server can't recognize the client
     * @param  {Object} sess  Persisting session object
     * @param  {Object} cache Cache object to write to
     * @return {Object}       User's info or false.
     */
    knowsClient: function(sess, cache) {
        /**
         * If a cache object was passed, store the user's data there
         */
        if (cache) {
            let loggedIn = false;

            if (sess.authenticatedUser) {
                loggedIn = {
                    id: sess.authenticatedUser.id,
                    fname: sess.authenticatedUser.fname,
                    lname: sess.authenticatedUser.lname,
                    email: sess.authenticatedUser.email
                };
            }

            /**
             * Save login details (or false if can't authenticate)
             */
            cache.set('loggedIn', loggedIn);
        }

        if(!sess.authenticatedUser) {
            cache.set('auth-error', true);
        }

        return sess.authenticatedUser || false;
    },

    /**
     * Recognizes (login) a client
     * @param  {Object} params Object with user's email, password
     * @param  {Object} cache  Cache object to write to
     * @param  {[type]} sess   [description]
     * @return {[type]}        [description]
     */
    login: function(params, cache, sess) {

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
                cache.set('errors', errors);
            }

            return Promise.resolve();
        };

        return new Entity.User({email: params.email}).fetch().then(function (match) {
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
