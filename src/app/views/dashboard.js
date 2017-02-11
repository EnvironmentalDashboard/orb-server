let defaultView = {
    index: function (res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            bulbListPromise = appmodel.retrieveBulbList(),
            orbListPromise = appmodel.retrieveOrbList();

        return Promise.all([bulbListPromise, orbListPromise]).then(function(results) {
            [bulbList, orbList] = results;

            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            let error = appmodel.getErrors(),
                labellingNotice = false;

            for (var key in bulbList) {
                let bulb = bulbList[key];

                if(bulb.info && (bulb.info.label.substring(0,4) === "LIFX"
                    || bulb.info.group.name === "My Room"
                    || bulb.info.location.name === "My Group")) {
                    labellingNotice = true;

                    break;
                }
            }

            return res.render('dashboard', {
                loggedIn: loggedIn,
                bulbs: bulbList,
                orbs: orbList,
                stylesheets: ['/orb-instructions/animations.css?'+(+new Date())],
                error: error,
                labellingNotice: labellingNotice
            });
        });
    }
};

module.exports = defaultView;
