let Service = require('../../model/services');

let authorizationController = {
    authorize: function(req, appmodel) {
        return Service.Account.prepareRedirect(req.session)
            .then(appmodel.setQueryString.bind(appmodel))
            .catch(appmodel.setErrors.bind(appmodel));
    },

    redirect: function(req, appmodel) {
        let params = {
            code: req.query.code,
            state: req.query.state
        };

        return Service.Account.authorize(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = authorizationController;
