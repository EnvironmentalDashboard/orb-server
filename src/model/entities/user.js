/**
 * @overview User entitiy
 */

let validator = require('validator');

let Orb = require('./orb'),
    Bulb = require('./bulb');

let User = {
    tableName: 'orb-server_users',

    orbs: function() {
        return this.hasMany('Orb', 'id');
    },

    bulbs: function() {
        return this.hasMany('Bulb', 'id');
    },

    validate: function() {
        let fname = this.get('fname'),
            lname = this.get('lname'),
            email = this.get('email'),
            password = this.get('password');

        let errors = {};

        //Name must be allphanumeric
        if ((fname !== undefined &&
                !fname.match(/^[0-9a-z ]+$/i) &&
                fname.length !== 0) ||
            (lname !== undefined &&
                !lname.match(/^[0-9a-z ]+$/i) &&
                lname.length !== 0)) {
            errors.name = ['Name fields must be alphanumeric (0-9 A-Z).'];
        }

        // Passwords have minlneghth 5
        if (password !== undefined && password.length < 5) {
            errors.password = ['Password too short (5 characters minimum).'];
        }

        // Invalid email
        if (email !== undefined && !validator.isEmail(email)) {
            errors.email = ['Email not valid'];
        }

        if (Object.keys(errors).length !== 0) {
            return Promise.resolve(errors);
        } else {
            return Promise.resolve();
        }
    }
};

module.exports = User;
