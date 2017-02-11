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

            let error = appmodel.getErrors();

            return res.render('dashboard', {
                loggedIn: loggedIn,
                bulbs: bulbList,
                orbs: orbList,
                stylesheets: ['/orb-instructions/animations.css?'+(+new Date())],
                error: error
            });
        });
    }
};

module.exports = defaultView;
