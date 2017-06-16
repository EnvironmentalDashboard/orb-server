let Service = require('../../model/services');

let docsController = {
    index: function(req, appmodel) {
        return appmodel.setSlug(req.params.page).catch(appmodel.setErrors.bind(appmodel));
    },
};

module.exports = docsController;
