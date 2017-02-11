let lifx_api = "https://cloud.lifx.com/oauth";

let authenticationView = {
    authorize: function (res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            queryString = appmodel.getQueryString();

        if(!loggedIn) {
            return res.render('denied');
        }

        res.redirect(lifx_api + '/authorize?' + queryString);
    },

    redirect: function (res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if(!loggedIn) {
            return res.render('denied');
        }

        return res.render('auth-success', {
            loggedIn: loggedIn
        });
    },

    confirm: function (res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if(!loggedIn) {
            return res.render('denied');
        }

        return res.render('auth-confirm', {
            loggedIn: loggedIn
        });
    }
};

module.exports = authenticationView;
