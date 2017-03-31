let Service = require('../../model/services');

let authorizationController = {
    authorize: function(req, appmodel) {
        return Service.BulbIntegration.prepareRedirect(req.params.integrationId || null, 'LIFX', req.session)
            .then(appmodel.setRedirectAddress.bind(appmodel))
            .catch(appmodel.setErrors.bind(appmodel));
    },

    label: function(req, appmodel) {
        let params = {
            id: req.params.integrationId,
            label: req.body.label
        };

        appmodel.setInputs(req.body);
        appmodel.setTargetIntegration(req.params.integrationId);

        return Service.BulbIntegration.updateLabel(params, req.session)
            .catch(appmodel.setErrors.bind(appmodel));
    },

    confirm: function(req, appmodel) {
        if(req.params.integrationId) {
            appmodel.setIntegration(req.params.integrationId);
        }

        return Promise.resolve();
    },

    load: function(req, appmodel) {
        appmodel.setTargetIntegration(req.params.integrationId);
        return Promise.resolve();
    },

    redirect: function(req, appmodel) {
        let params = {
            code: req.query.code,
            state: req.query.state,
            integrationId: req.query.state.split('~')[1] || null
        },
            type = 'LIFX';

        return Service.BulbIntegration.authorize(params, type, req.session)
            .then(appmodel.setIntegration.bind(appmodel))
            .catch(appmodel.setErrors.bind(appmodel));
    },

    delete: function(req, appmodel) {
        return Service.BulbIntegration.delete(req.params.integrationId, req.session)
            .catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = authorizationController;
