/**
 * Page view
 */

let base = require('./base');

let page = Object.assign({
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
            authorizationNotice = cache.get('authorization-notice'),
            labellingNotice = cache.get('labelling-notice');

        res.render('dashboard', {
            loggedIn: cache.get('loggedIn'),
            orbs: orbList,
            bulbs: bulbList,
            authorizationNotice: authorizationNotice,
            labellingNotice: labellingNotice,
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
            additionalStylesheets: ['/css/orbs.animation.css?'+(+new Date())]
        });
    },

    newOrb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list'),
            defaultDataGrouping = [[1,2,3,4,5,6,7]];

        res.render('orb-config', {
            loggedIn: cache.get('loggedIn'),
            buildings: meterList,
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            form: {daySets: defaultDataGrouping},
            helpers: {
                selected: function() { return ''; },
                checked: function (array, haystackIndex, needle) {
                    if (defaultDataGrouping[haystackIndex] && defaultDataGrouping[haystackIndex].indexOf(needle+1) > -1) {
                        return ' checked';
                    }
                }
            }
        });
    },

    deleteOrb: function (res, cache) {
        console.log('ok?');
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('orb-delete-confirm', {
            orb: cache.get('orb-info')
        });
    },

    editOrb: function (res, cache) {

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let meterList = cache.get('meter-list'),
            dataGrouping = JSON.parse(cache.get('orb-info').daySets);

        res.render('orb-config', {
            loggedIn: cache.get('loggedIn'),
            buildings: meterList,
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            form: cache.get('orb-info'),
            helpers: {
                selected: function (selectedValue, comparedValue) {
                    if(selectedValue == comparedValue) {
                        return ' selected';
                    }
                },

                checked: function (array, haystackIndex, needle) {
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

        res.render('orb-config-success', {
            loggedIn: cache.get('loggedIn')
        });
    },

    authConfirm: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('auth-confirm');
    },

    guide: function (res, cache) {
        res.render('guide', {
            loggedIn: cache.get('loggedIn')
        });
    },

    account: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('account', {
            loggedIn: cache.get('loggedIn')
        });
    },

    accountConfig: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let userInfo = cache.get('loggedIn');

        res.render('account-config', {
            loggedIn: userInfo,
            form: userInfo
        });
    },

    accountConfigSuccess: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('account-config-success', {
            loggedIn: cache.get('loggedIn')
        });
    },

    securityConfig: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.render('account-password-config', {
            loggedIn: cache.get('loggedIn')
        });
    },
}, base);

module.exports = page;
