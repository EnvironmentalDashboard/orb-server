/**
 * @overview Responsible for account services
 */

let request = require('request-promise-native'),
    validator = require('validator'),
    sodium = require('sodium').api;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    Organization = require('./Organization');

let Account = {

    /**
     * Takes parameters and attempts registration.
     * @param  {Object} params Registration parameters
     * @return {Promise} Resolves on success, rejects on errors.
     */
    register: function(params) {
        let email = params.email.trim(),
            fname = params.fname.trim(),
            lname = params.lname.trim(),
            password1 = params.password1,
            password2 = params.password2,
            organizations = params.organizations;

        let errors = {};

        if (password1 !== password2) {
            errors.confirm = ['Passwords must match.'];
        }

        /**
         * Forge a User instance to validate and manipulate
         * @type {User}
         */
        let user = new Entity.User({
            email: email,
            fname: fname,
            lname: lname,
            password: password1
        });

        return user.validate().then(function(validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs); //Merge errors
            }

            //Stop registation if user's email didn't validate
            if (errors.email) {
                return Promise.reject(errors);
            }

            /**
             * Fetch users by inputted email to check for pre-existing users
             * with same email
             */
            return new Entity.User({
                email: email
            }).fetch();
        }).then(function(match) {
            if (match) {
                errors.email = ['Email already taken.'];
            }

            //Any eerrors up until now justify rejection
            if (Object.keys(errors).length !== 0) {
                return Promise.reject(errors);
            }

            /**
             * Generate password hash using Argon 2i and register the user
             */
            let pwdBuffer = Buffer.from(password1);

            let hash = Buffer.from(sodium.crypto_pwhash_argon2i_str(
                pwdBuffer,
                3,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
            ));

            return user.save({
                password: hash
            });

        }).then(function(){
            return Organization.addToUser(user, organizations);
        });
    },

    /**
     * Updates user's password
     * @param  {Object} params Password update parameters
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     */
    updatePassword: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let password = params.password,
            newPassword = params.newPassword,
            confirmNewPassword = params.confirmNewPassword;

        let errors = {};

        if (newPassword !== confirmNewPassword) {
            errors.confirm = ['Passwords must match.'];
        }

        return new Entity.User({
            password: newPassword
        }).validate().then(function(validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs); //Merge errors
            }

            /**
             * Fetch user and confirm that their (old) password authenticates
             */
            return new Entity.User({
                id: client.id
            }).fetch();
        }).then(function(user) {
            if (!user) {
                errors.general = ['Couldn\'t find user'];
                return Promise.reject(errors);
            }

            /**
             * Use Argon 2i to confirm match
             */
            let pwdHash = Buffer.from(user.get('password')),
                pwdBuffer = Buffer.from(password);

            if (!sodium.crypto_pwhash_argon2i_str_verify(pwdHash, pwdBuffer)) {
                errors.auth = ['Credentials did not authenticate.'];
            }

            if (Object.keys(errors).length !== 0 || !user) {
                return Promise.reject(errors);
            }

            /**
             * Generate password hash using Argon 2i and save user
             */
            pwdBuffer = Buffer.from(newPassword);

            let hash = Buffer.from(sodium.crypto_pwhash_argon2i_str(
                pwdBuffer,
                3,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
            ));

            return user.set({
                password: hash
            }).save();
        });
    },

    /**
     * Updates user's account information
     * @param  {Object} params Account update parameters
     * @param  {Object} sess Session object
     * @return {Promise} Resolves on success, rejects on errors.
     */
    updateInformation: function(params, sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let fname = params.fname.trim(),
            lname = params.lname.trim();

        let errors = {};

        /**
         * Forge a User entity from the inputted values and validate this information
         */
        let user = new Entity.User({
            fname: fname,
            lname: lname,
            id: client.id
        });

        return user.validate().then(function(validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs); //Merge errors
            }

            if (Object.keys(errors).length !== 0) {
                return Promise.reject(errors);
            }

            /**
             * No errors; save and resolve
             */
            return user.save();
        });
    }

};

module.exports = Account;
