let Service = require('../../model/services');

let accountController = {
    index: function (req, appmodel) {
        return Service.Recognition.refreshClient(req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    config: function (req, appmodel) {
        let params = {
            fname: req.body.fname,
            lname: req.body.lname
        };

        appmodel.setInputs(params);
        return Service.Account.updateInformation(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    updatePassword: function (req, appmodel) {
        let params = {
            password: req.body.password,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirm
        };

        appmodel.setInputs({ values: true });
        return Service.Account.updatePassword(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    register: function (req, appmodel) {
        let params = {
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password1: req.body.password,
            password2: req.body.confirm
        };

        delete req.body.password;
        delete req.body.confirm;

        appmodel.setInputs(req.body);

        return Service.Account.register(params, req.cache).catch(function (errors) {
            appmodel.setErrors(errors);
        });
    }
};

module.exports = accountController;
