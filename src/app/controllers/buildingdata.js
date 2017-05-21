let Service = require('../../model/services');

let dataController = {
    configure: function(req, appmodel) {
        let params = {
            username: req.body.username,
            password: req.body.password,
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret
        };

        appmodel.setInputs(params);

        return Service.BuildingDataIntegration
                .save(params, req.session)
                .catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = dataController;
