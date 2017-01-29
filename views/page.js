/**
 * Page view
 *
 * @todo The function `page.newOrb` passes a helper function to the rendered
 * presentation, rather than having this helper inside the helper function lib
 * file (/lib/helpers.hbs.js). This is because of a Handlebars 4.0 bug (see
 * https://github.com/wycats/handlebars.js/issues/1300#issuecomment-274667152 for
 * info on status). Once this bug is fixed, the `defaultDataGrouping` duplicative
 * variable can be removed and the helper function can be moved to the lib file.
 */

let page = {
    index: function (req, res, next) {

        res.render('default', {loggedIn: req.cache.get('loggedIn')});
    },

    signin: function (req, res, next) {

        res.render('login', {
            loggedIn: req.cache.get('loggedIn'),
            active: {signin: true}
        });
    },

    signup: function (req, res, next) {

        res.render('register', {
            loggedIn: req.cache.get('loggedIn'),
            active: {signup: true}
        });
    },

    signupSuccess: function (req, res, next) {

        res.render('register-success', {active: {signup: true}});
    },

    dashboard: function (req, res, next) {
        let orbList = req.cache.get('orb-list'),
            bulbList = req.cache.get('bulb-list'),
            authorizationNotice = req.cache.get('authorization-notice'),
            labellingNotice = req.cache.get('labelling-notice');

        res.render('dashboard', {
            loggedIn: req.cache.get('loggedIn'),
            active: {dashboard: true},
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

    newOrb: function (req, res, next) {
        let meterList = req.cache.get('meter-list'),
            defaultDataGrouping = [[1,2,3,4,5,6,7]];

        res.render('orb-config', {
            loggedIn: req.cache.get('loggedIn'),
            active: {dashboard: true},
            buildings: meterList,
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            form: {daySets: defaultDataGrouping},
            helpers: {
                checked: function (array, haystackIndex, needle) {
                    if (defaultDataGrouping[haystackIndex] && defaultDataGrouping[haystackIndex].indexOf(needle+1) > -1) {
                        return ' checked';
                    }
                }
            }
        });
    },

    deleteOrb: function (req, res, next) {
        res.render('orb-delete-confirm', {
            active: {dashboard: true},
            orb: req.cache.get('orb-info')
        });
    },

    editOrb: function (req, res, next) {
        let meterList = req.cache.get('meter-list'),
            dataGrouping = JSON.parse(req.cache.get('orb-info').daySets);

        res.render('orb-config', {
            loggedIn: req.cache.get('loggedIn'),
            active: {dashboard: true},
            buildings: meterList,
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            form: req.cache.get('orb-info'),
            helpers: {
                checked: function (array, haystackIndex, needle) {
                    if (dataGrouping[haystackIndex] && dataGrouping[haystackIndex].indexOf(needle+1) > -1) {
                        return ' checked';
                    }
                }
            }
        });
    },

    orbSuccess: function (req, res, next) {
        res.render('orb-config-success', {
            loggedIn: req.cache.get('loggedIn'),
            active: {dashboard: true},
        });
    },

    authConfirm: function (req, res, next) {
        res.render('auth-confirm', {active: {account: true}});
    },

    guide: function (req, res, next) {
        res.render('guide', {
            loggedIn: req.cache.get('loggedIn'),
            active: {guide: true},
        });
    },

    account: function (req, res, next) {
        res.render('account', {
            loggedIn: req.cache.get('loggedIn'),
            active: {account: true},
        });
    },

    accountConfig: function (req, res, next) {
        let userInfo = req.cache.get('loggedIn');

        res.render('account-config', {
            loggedIn: userInfo,
            active: {account: true},
            form: userInfo
        });
    },

    accountConfigSuccess: function (req, res, next) {
        res.render('account-config-success', {
            loggedIn: req.cache.get('loggedIn'),
            active: {account: true}
        });
    },

    securityConfig: function (req, res, next) {
        res.render('account-password-config', {
            loggedIn: req.cache.get('loggedIn'),
            active: {account: true},
        });
    },
};

module.exports = page;
