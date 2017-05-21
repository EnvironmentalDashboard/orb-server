let accountView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            bulbIntegrationListPromise = appmodel.retrieveIntegrationList(),
            buildingDataIntegrationPromise = appmodel.retrieveBuildingDataIntegration();

        return Promise.all([bulbIntegrationListPromise, buildingDataIntegrationPromise]).then(function(results) {
            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            [integrationList, buildingDataIntegration] = results;

            /**
             * Building Data Integration Processing
             */
            let buildingsAPI = {};

            if(buildingDataIntegration && buildingDataIntegration.related) {
                buildingsAPI.username = buildingDataIntegration.relations.API.attributes.username;
            }

            /**
             * Bulb Integration processing
             */
            let integrations = [];

            integrationList.forEach(function(integration){
                integrations.push({
                    id: integration.attributes.id,
                    label: integration.attributes.label || false,
                    type: integration.attributes.type,
                    requiresAuth: integration.attributes.status !== 1,
                });
            });

            return res.render('account', {
                loggedIn: loggedIn,
                integrations: integrations,
                buildingsAPI: buildingsAPI
            });
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
