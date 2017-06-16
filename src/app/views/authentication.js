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
            form: form,
            page: {
                active: { signin: true },
                title: "Sign In"
            }
        });
    },

    logout: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (loggedIn) {
            //Something went wrong...
            return res.render('bad-request', {
                loggedIn: loggedIn,
                page: {
                    title: "Bad Request"
                }
            });
        }

        return res.render('logout-success', {
            page: {
                title: "Logged Out"
            }
        });
    }
};

module.exports = authenticationView;
