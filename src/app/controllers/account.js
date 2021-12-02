/* Creates a variable with access to everything inside our service folder inside of model*/
let Service = require('../../model/services');

/* 
Creates an accountController Object 
    - Containing following information
        - index
        - save
        - updatePassword
        - updateOrganizations
        - register
*/
let accountController = {
    index: function(req, appmodel) {
        return Service.Recognition.refreshClient(req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    /* Takes in new client information client and saves it */
    save: function(req, appmodel) {
        let params = {
            fname: req.body.fname,
            lname: req.body.lname
        };

        appmodel.setInputs(params);
        return Service.Account.updateInformation(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    /* Updates Password from inputs. Checsk ot see if prior password was correct before setting new password */
    updatePassword: function(req, appmodel) {
        let params = {
            password: req.body.password,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirm
        };

        appmodel.setInputs({
            values: true
        });
        return Service.Account.updatePassword(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    /* Checks to see if new organization is in our list of organizations. If not, it creates a new one */ 
    updateOrganizations: function(req, appmodel) {
        let organizations = Array.isArray(req.body.organizations) ? req.body.organizations : [req.body.organizations];

        return Service.Organization.updateUser(organizations, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    register: function(req, appmodel) {
        let params = {
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password1: req.body.password,
            password2: req.body.confirm,
            organizations: Array.isArray(req.body.organizations) ? req.body.organizations : [req.body.organizations]
        };

        delete req.body.password;
        delete req.body.confirm;
        delete req.body.bos_password;

        appmodel.setInputs(req.body);

        return Service.Account.register(params, req.cache).catch(function(errors) {
            appmodel.setErrors(errors);
        });
    }
};

module.exports = accountController;
