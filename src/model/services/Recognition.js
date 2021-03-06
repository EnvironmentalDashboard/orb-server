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

    knowsClient: function(sess) {
        let loggedIn = false;

        if (sess.authenticatedUser) {
            loggedIn = true;
        }

        return sess.authenticatedUser || loggedIn;
    },

    refreshClient: function(sess) {
        let loggedIn = false;

        if (!sess.authenticatedUser) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.User({
            id: sess.authenticatedUser.id
        }).fetch().then(function(match) {
            Recognition.certifyClient(match, sess);

            return Promise.resolve(match);
        });
    },

    forget: function(sess) {
        sess.authenticatedUser = null;
        return Promise.resolve();
    },


    login: function(params, sess) {

        /**
         * Need to keep track of errors
         * @type {Object}
         */
        let errors = {};

        return new Entity.User({
            email: params.email
        }).fetch().then(function(match) {
            if (match) {
                let pwdHash = Buffer.from(match.get('password')),
                    pwdBuffer = Buffer.from(params.password);

                if (sodium.crypto_pwhash_argon2i_str_verify(pwdHash, pwdBuffer)) {
                    if (Object.keys(errors).length !== 0) {
                        return Promise.reject(errors);
                    }

                    /**
                     * Certify the client if argon2i certifies the hash w/ the
                     * entered password
                     */

                    Recognition.certifyClient(match, sess);

                    return Promise.resolve();
                }
            }

            /**
             * There wasn't a match or this thread is still going because the
             * client failed to authenticate
             */
            errors.login = ['Credentials did not authenticate. Please try again.'];
            return Promise.reject(errors);
        });

    }

};

module.exports = Recognition;
