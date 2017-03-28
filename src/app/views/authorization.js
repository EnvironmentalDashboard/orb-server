let authenticationView = {
    authorize: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            redirectAddress = appmodel.getRedirectAddress();

        if (!loggedIn) {
            return res.render('denied');
        }

        res.redirect(redirectAddress);
    },

    redirect: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors();

        if (!loggedIn) {
            return res.render('denied');
        }

        return res.render('auth-redirect', {
            loggedIn: loggedIn,
            errors: errors,
            integration: appmodel.getIntegration()
        });
    },

    confirm: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (!loggedIn) {
            return res.render('denied');
        }

        return res.render('auth-confirm', {
            loggedIn: loggedIn
        });
    },

    label: function(res, appmodel) {
        //@todo make sure user is editting a valid integration

        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors(),
            form = appmodel.getInputs();

        if (!loggedIn) {
            return res.render('denied');
        }

        if(!errors && Object.keys(form).length > 1) {
            return res.redirect('/auth/label/success');
        }

        return res.render('auth-redirect', {
            loggedIn: loggedIn,
            errors: errors,
            integration: appmodel.getIntegration()
        });
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('auth-success', {
            loggedIn: loggedIn
        });
    }
};

module.exports = authenticationView;
