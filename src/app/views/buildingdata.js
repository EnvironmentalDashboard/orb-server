let dataView = {
    configure: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            errors = appmodel.getErrors();

        if(!loggedIn) {
            return res.render('denied');
        }

        if(!errors && Object.keys(form).length !== 0) {
            return res.redirect('/building-data/success');
        }

        return res.render('building-data-config', {
            loggedIn: loggedIn,
            errors: errors,
            form: form,
            page: {
                title: "Building Integration Configuration"
            }
        });
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('building-data-success', {
            loggedIn: loggedIn,
            page: {
                title: "Configuration Success"
            }
        })
    }
};

module.exports = dataView;
