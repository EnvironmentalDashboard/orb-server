let Service = require('../../model/services');

let authenticationController = {
    login: function(req, appmodel) {
        let params = {
            email: req.body.email,
            password: req.body.password
        };

        return Service.Recognition.login(params, req.session).catch(function(errors) {
            appmodel.setErrors(errors);

            //Omit password from assignment
            delete params.password;
            appmodel.setInputs(params);
        });
    },

    logout: function(req, appodel) {
        return Service.Recognition.forget(req.session);
    }
};

module.exports = authenticationController;
