let Service = require('../../model/services');

let authorizationController = {
    authorize: function(req, appmodel) {
        return Service.BulbIntegration.prepareRedirect('LIFX', req.session)
            .then(appmodel.setRedirectAddress.bind(appmodel))
            .catch(appmodel.setErrors.bind(appmodel));
    },

    label: function(req, appmodel) {
        let params = {
            id: req.params.integrationId,
            label: req.body.label
        };

        appmodel.setInputs(req.body);

        return Service.BulbIntegration.updateLabel(params, req.session)
            .catch(appmodel.setErrors.bind(appmodel));
    },

    load: function(req, appmodel) {

    },

    redirect: function(req, appmodel) {
        let params = {
            code: req.query.code,
            state: req.query.state
        },
            type = 'LIFX';

        return Service.BulbIntegration.authorize(params, type, req.session)
            .then(appmodel.setIntegration.bind(appmodel))
            .catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = authorizationController;
