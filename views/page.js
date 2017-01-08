/**
 * Page view
 */

let base = require('./base');

let page = Object.assign(base, {
    index: function (res, cache) {

        res.render('default');
    },

    signin: function (res, cache) {

        res.render('login');
    },

    signup: function (res, cache) {

        res.render('register');
    },

    signupSuccess: function (res, cache) {

        res.render('register-success');
    },

    dashboard: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('dashboard');
    },

    neworb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list');

        res.render('addorb', {
            buildings: meterList
        });
    }
});

module.exports = page;
