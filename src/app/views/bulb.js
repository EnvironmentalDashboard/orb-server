let bulbView = {
    configure: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            bulbPromise = appmodel.retrieveTargetBulb(),
            orbListPromise = appmodel.retrieveOrbList();

        return Promise.all([bulbPromise, orbListPromise]).then(function(results) {
            [bulb, orbList] = results;


            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            let form = {
                orb: bulb.attributes.orb,
                pulse_intensity: bulb.attributes.pulse_intensity,
                brightness: bulb.attributes.brightness,
                enabled: bulb.attributes.enabled,
                selector: bulb.attributes.selector,
                integration: bulb.attributes.integration
            };

            return res.render('bulb-config', {
                form: form,
                orbs: orbList,
                loggedIn: loggedIn,
                page: {
                    active: { dashboard: true },
                    title: "Bulb Configuration"
                },
                helpers: {
                    checked: function(checkedValue, comparedValue) {
                        if (checkedValue == comparedValue) {
                            return ' checked';
                        }
                    },

                    selected: function(selectedValue, comparedValue) {
                        if (parseFloat(selectedValue) == parseFloat(comparedValue)) {
                            return ' selected';
                        }
                    },
                }
            });
        }).catch(function(err) {
            return res.render('no-record', {
                loggedIn: loggedIn
            });
        });
    }
};

module.exports = bulbView;
