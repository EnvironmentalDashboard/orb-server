let accountView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('account', {
            loggedIn: loggedIn
        });
    },

    save: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            errors = appmodel.getErrors();

        if (appmodel.getAuthError()) {
            return res.render('denied');
        }

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/config/success');
        }

        return res.render('account-config', {
            loggedIn: loggedIn,
            form: form || loggedIn,
            errors: errors
        });
    },

    updatePassword: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors(),
            form = appmodel.getInputs();

        if (!loggedIn) {
            return res.render('denied');
        }

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/config/success');
        }

        return res.render('account-password-config', {
            loggedIn: loggedIn,
            errors: errors
        });
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (!loggedIn) {
            return res.render('denied');
        }

        return res.render('account-config-success', {
            loggedIn: loggedIn
        });
    },

    register: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            errors = appmodel.getErrors();

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/signup/success');
        }

        console.log(errors);

        return res.render('register', {
            loggedIn: loggedIn,
            form: form,
            errors: errors
        });
    },

    registerSuccess: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('register-success', {
            loggedIn: loggedIn
        });
    }
};

module.exports = accountView;
