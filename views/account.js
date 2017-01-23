/**
 * Account view
 */

let base = require('./base');

let account = Object.assign({
    register: function (res, cache) {

        cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the registration page again
             */
            if (val !== undefined) {
                res.render('register', {
                    loggedIn: cache.get('loggedIn'),
                    errors: val,
                    form: cache.get('form')
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/signup/success');
            }
        });

    },

    update: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {
                
                res.render('account-config', {
                    loggedIn: cache.get('loggedIn'),
                    errors: val,
                    form: cache.get('form')
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/config/success');
            }
        });

    },

    updatePassword: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the config page again
             */
            if (val !== undefined) {
                res.render('account-password-config', {
                    loggedIn: cache.get('loggedIn'),
                    errors: val
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/config/success');
            }
        });

    }

}, base);

module.exports = account;
