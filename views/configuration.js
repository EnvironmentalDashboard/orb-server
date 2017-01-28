/**
 * Dashboard view
 */

let configuration = {
    orb: function (req, res, next) {
        req.cache.get('errors', function (err, val) {

            let meterList = req.cache.get('meter-list');

            /**
             * If there were errors, render the orb creation page again
             */
            if (val !== undefined) {
                res.render('addorb', {
                    loggedIn: req.cache.get('loggedIn'),
                    active: {dashboard: true},
                    errors: val,
                    form: req.cache.get('form'),
                    buildings: meterList,
                    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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

            /**
             * Otherwise orb creation was a success
             */
            } else {
                res.redirect('/dash/orb/success');
            }
        });

    },

    deleteOrb: function(req, res, next) {
        res.redirect('/dash');
    },

    bulb: function (req, res, next) {
        res.redirect('/dash');
    }

};

module.exports = configuration;
