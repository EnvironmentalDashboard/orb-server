let defaultView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            bulbListPromise = appmodel.retrieveBulbList(),
            orbListPromise = appmodel.retrieveOrbList(),
            integrationListPromise = bulbListPromise.then(appmodel.retrieveIntegrationList.bind(appmodel));

        return Promise.all([bulbListPromise, orbListPromise, integrationListPromise]).then(function(results) {
            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            [bulbList, orbList, integrationList] = results;

            let integrationError = false;

            integrationList.forEach(function(integration){
                if(integration.get('status') === 0) {
                    integrationError = true;
                }
            });

            let error = appmodel.getErrors(),
                labellingNotice = false;

            for (var key in bulbList) {
                let bulb = bulbList[key];

                if (bulb.info && (bulb.info.label.substring(0, 4) === "LIFX" ||
                        bulb.info.group.name === "My Room" ||
                        bulb.info.location.name === "My Group")) {
                    labellingNotice = true;

                    break;
                }
            }

            return res.render('dashboard', {
                loggedIn: loggedIn,
                bulbs: bulbList,
                orbs: orbList,
                stylesheets: ['/orb-instructions/animations.css?' + (+new Date())],
                integration: {
                    none: integrationList.length < 1,
                    errors: integrationError
                },
                labellingNotice: labellingNotice
                active: { dashboard: true },
            });
        });
    }
};

module.exports = defaultView;
