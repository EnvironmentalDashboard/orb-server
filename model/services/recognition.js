/**
 * @overview Responsible for user recognition
 */

let sodium = require('sodium').api;

let Entity = require('../entities');

let Recognition = {

    certifyClient: function(user, sess) {
        sess.authenticatedUser = user.attributes;

        return sess.authenticatedUser;
    },

    /**
     * Returns the authenticated client's account information or false if the
     * server can't recognize the client
     * @param  {Object} sess  Persisting session object
     * @param  {Object} cache Cache object to write to
     * @return {Object}       User's info or false.
     */
    knowsClient: function(sess, cache) {
        let loggedIn = false;

        if(!sess.authenticatedUser) {
            cache.set('auth-error', true);
            return false;
        }

        cache.set('loggedIn', sess.authenticatedUser);
        return sess.authenticatedUser;
    },

    /**
     * Same as knowsClient but regathers the users info from the datbaase
     * @param  {Object} sess  Persisting session object
     * @param  {Object} cache Cache object to write to
     * @return {Object}       User's info or false.
     */
    refreshClient: function (sess, cache) {
        let loggedIn = false, me = this;

        if(!sess.authenticatedUser) {
            cache.set('auth-error', true);
            return false;
        }

        return new Entity.User({id: sess.authenticatedUser.id}).fetch().then(function (match) {
            me.certifyClient(match, sess);
            cache.set('loggedIn', match);

            return match;
        });
    },

    forget: function(sess, cache) {
        sess.authenticatedUser = null;
        cache.set('loggedIn', sess.authenticatedUser);
        cache.set('auth-error', true);
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
