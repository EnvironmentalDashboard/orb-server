/**
 * @overview Responsible for user-related services
 */

let validator = require('validator'),
    sodium = require('sodium').api;

let Entity = require('../entities');

let User = {

    register: function (params, reqCache, done) {

        /**
         * Validation
         */

        let email = params.email.trim(),
            fname = params.fname.trim(),
            lname = params.lname.trim(),
            password1 = params.password1,
            password2 = params.password2;

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
                reqCache.set('form', {
                    email: email,
                    fname: fname,
                    lname: lname
                });
            }

            done();
        };

        // Name must be alphanumeric
        if ((!fname.match(/^[0-9a-z ]+$/i) && fname.length !== 0)
            || (!lname.match(/^[0-9a-z ]+$/i) && lname.length !== 0)) {
            errors.name = ['Name fields must be alphanumeric (0-9a-Z).'];
        }

        // Passwords must match
        if (password1 != password2) {
            errors.password = ['Passwords must match.'];

        // Passwords have minlneghth 5
        } else if (password1.length < 5) {
            errors.password = ['Password too short (5 characters minimum).'];
        }

        // Invalid email
        if (!validator.isEmail(email)) {
            errors.email = ['Email not valid'];

            // We don't need to check if the email is already taken in the case
            // that the email is invalid. So just resolve here
            return resolve();
        }

        /**
         * Resolve if email is already taken or there exists other errors
         * @param {[type]} {email: email} [description]
         */
        new Entity.User({email: email}).fetch().then(function (match) {
            if (match) {
                errors.email = ['This email already exists in our database.'];
            }

            if(Object.keys(errors).length !== 0) {
                return resolve();
            }

            /**
             * Save to the database if you've made it this far
             */

            let pwdBuffer = Buffer.from(password1);

            let hash = Buffer.from(sodium.crypto_pwhash_argon2i_str(
                pwdBuffer,
                sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
            ));

            new Entity.User({
                email: email,
                lname: lname,
                fname: fname,
                password: hash
            }).save().then(function() {
                return resolve();
            });

        });
    }

};

module.exports = User;
