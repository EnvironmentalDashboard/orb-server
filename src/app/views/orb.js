let orbView = {
    configure: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            meterListPromise = appmodel.retrieveMeterList(),
            orbPromise = appmodel.retrieveTargetOrb();

        return Promise.all([meterListPromise, orbPromise]).then(function(results) {
            let errors = appmodel.getErrors();

            [metersByBuilding, orbInfo] = results;

            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            if (errors.noRecord) {
                return res.render('no-record');
            }

            if (!errors && Object.keys(form).length > 1) {
                return res.redirect('/dash/orb/success');
            }

            return res.render('orb-config', {
                loggedIn: loggedIn,
                errors: errors,
                form: Object.assign({}, orbInfo, form),
                buildings: metersByBuilding,
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                helpers: {
                    checked: function(array, haystackIndex, needle) {
                        let dataGrouping = [
                            [1, 2, 3, 4, 5, 6, 7]
                        ];

                        if (orbInfo && orbInfo.daySets) {
                            dataGrouping = JSON.parse(orbInfo.daySets);
                        }

                        if (dataGrouping[haystackIndex] && dataGrouping[haystackIndex].indexOf(needle + 1) > -1) {
                            return ' checked';
                        }
                    },

                    add: function(a, b) {
                        return a + b;
                    }
                }
            });
        });
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('orb-config-success', {
            loggedIn: loggedIn
        });
    },

    deletePrompt: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            orbPromise = appmodel.retrieveTargetOrb();

        return orbPromise.then(function(orbInfo) {
            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            if (errors.noRecord) {
                return res.render('no-record');
            }

            res.render('orb-delete-confirm', {
                loggedIn: loggedIn,
                orb: orbInfo
            });
        });
    },

    delete: function(res, appmodel) {
        res.redirect('/dash');
    }
};

module.exports = orbView;
