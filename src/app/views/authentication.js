let authenticationView = {
    login: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors(),
            form = appmodel.getInputs();

        if (loggedIn) {
            return res.redirect('/dash');
        }

        return res.render('login', {
            loggedIn: loggedIn,
            errors: errors,
            form: form
        });
    },

    logout: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (loggedIn) {
            //Something went wrong...
            return res.render('bad-request', {
                loggedIn: loggedIn
            });
        }

        return res.render('logout-success');
    }
};

module.exports = authenticationView;
