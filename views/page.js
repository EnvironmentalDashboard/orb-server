/**
 * Page view
 */

let base = require('./base');

let page = Object.assign(base, {
    index: function (res, cache) {

        res.render('default', {loggedIn: cache.get('loggedIn')});
    },

    signin: function (res, cache) {

        res.render('login', {loggedIn: cache.get('loggedIn')});
    },

    signup: function (res, cache) {

        res.render('register', {loggedIn: cache.get('loggedIn')});
    },

    signupSuccess: function (res, cache) {

        res.render('register-success');
    },

    dashboard: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let orbList = cache.get('orb-list'),
            bulbList = cache.get('bulb-list'),
            authorizationNotice = cache.get('authorization-notice');

        res.render('dashboard', {
            loggedIn: cache.get('loggedIn'),
            orbs: orbList,
            bulbs: bulbList,
            authorizationNotice: authorizationNotice,
            helpers: {
                selectOrbList: function(orbs, defaultSelected){
                    let out = '<option value="">No orb selected</option>';

                    orbs.forEach(function(orb){
                        let selected = orb.id === defaultSelected ? 'selected' : '';

                        out += '<option value="'+orb.id+'" '+selected+'>'+orb.title+'</option>';
                    });

                    return out;
                }
            }
        });
    },

    neworb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list');

        res.render('addorb', {
            loggedIn: cache.get('loggedIn'),
            buildings: meterList
        });
    },

    orbSuccess: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('neworb-success');
    },

    authConfirm: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('authconfirm');
    }
});

module.exports = page;
