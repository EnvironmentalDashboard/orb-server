/**
 * Dashboard view
 *
 * @todo The function `configuration.orb` passes a helper function to the rendered
 * presentation, rather than having this helper inside the helper function lib
 * file (/lib/helpers.hbs.js). This is because of a Handlebars 4.0 bug (see
 * https://github.com/wycats/handlebars.js/issues/1300#issuecomment-274667152 for
 * info on status). Once this bug is fixed, the `dataGrouping` duplicative variable
 * can be removed and the helper function can be moved to the lib file.
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
