let Service = require('../../model/services');

var account = {
    inputs: false,

    setInputs: function(inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },

    retrieveIntegrationList: function() {
        return Service.BulbIntegrationList.retrieve(this.session).catch(this.setErrors.bind(this));
    },

    retrieveOrganizationList: function() {
        return Service.OrganizationList.retrieve().catch(this.setErrors.bind(this));
    },

    retrieveUserOrganizationList: function() {
        return Service.OrganizationList.retrieveForUser(this.session).catch(this.setErrors.bind(this));
    }

};

module.exports = account;
