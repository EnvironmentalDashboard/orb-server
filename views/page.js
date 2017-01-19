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
            },
            additionalStylesheets: ['/css/orbs.animation.css']
        });
    },

    newOrb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list'),
            days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        res.render('orb-config', {
            loggedIn: cache.get('loggedIn'),
            buildings: meterList,
            days: days
        });
    },

    editOrb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list'),
            days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dataGrouping = JSON.parse(cache.get('orb-info').daySets);

        res.render('orb-config', {
            loggedIn: cache.get('loggedIn'),
            buildings: meterList,
            days: days,
            form: cache.get('orb-info'),
            helpers: {
                selected: function (selectedValue, comparedValue) {
                    if(selectedValue == comparedValue) {
                        return ' selected';
                    }
                },

                checked: function (array, haystackIndex, needle) {
                    console.log(dataGrouping);

                    if (dataGrouping[haystackIndex] && dataGrouping[haystackIndex].indexOf(needle+1) > -1) {
                        return ' checked';
                    }
                }
            }
        });
    },

    orbSuccess: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('neworb-success', {
            loggedIn: cache.get('loggedIn')
        });
    },

    authConfirm: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('authconfirm');
    },

    guide: function (res, cache) {
        res.render('guide', {
            loggedIn: cache.get('loggedIn')
        });
    }
});

module.exports = page;
