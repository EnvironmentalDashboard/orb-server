let Service = require('../../model/services');

let integrationController = {
    index: function(req, appmodel) {
        return Service.Recognition.refreshClient(req.session).catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = integrationController;
