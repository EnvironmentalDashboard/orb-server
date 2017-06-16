let integrationsView = {

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

            return res.render('integrations', {
                loggedIn: loggedIn,
                integrations: integrations,
                buildingsAPI: buildingsAPI,
                page: {
                    active: {account:true},
                    title: "Integrations"
                }
            });
        });
    }

};

module.exports = integrationsView;
