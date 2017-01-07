/**
 * @overview Responsible for user-related services
 */

let validator = require('validator');

let Entity = require('../entities');

let User = {

    register: function (params, cache, done) {

        /**
         * Validation
         */

        let email = params.email.trim(),
            fname = params.fname.trim(),
            lname = params.lname.trim(),
            password1 = params.password1,
            password2 = params.password2;

        // Name must be alphanumeric
        if ((!fname.match(/^[0-9a-z ]+$/) && fname.length != 0)
            || (lname.match(/^[0-9a-z ]+$/) && lname.length != 0)) {
            console.log('name must be alphanumeric');
        }

        // Passwords must match
        if (password1 != password2) {
            console.log('passwords dont match');

        // Passwords have minlneghth 5
        } else if (password1.length < 5) {
            console.log('password too short');
        }

        // Invalid email
        if (!validator.isEmail(email)) {
            console.log('invalid email');
            done();
        } else {

            // Resolve if the email is already taken
            new Entity.User({email: email}).fetch().then(function (match) {
                if (match) {
                    console.log('email taken');
                    done();
                }
            });
        }
        /**
         * Save to database
         */
    }

};

module.exports = User;
