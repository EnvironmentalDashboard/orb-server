let Service = require('../../model/services');

var authentication = {
    integration: null,
    inputs: {},
    redirectAddress: null,
    targetIntegration: null,

    setIntegration: function(integration) {
        this.integration = integration;
    },

    getIntegration: function() {
        return this.integration;
    },

    setInputs: function(inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },

    setRedirectAddress: function(redirectAddress) {
        this.redirectAddress = redirectAddress;
    },

    getRedirectAddress: function(redirectAddress) {
        return this.redirectAddress;
    },

    setTargetIntegration: function(id) {
        this.targetIntegration = id;
    },

    retrieveTargetIntegration: function() {
        if (!this.targetIntegration) {
            return Promise.resolve();
        }

        return Service.BulbIntegration.retrieve(this.targetIntegration, this.session).then(function(integration) {
            return Promise.resolve(integration.attributes);
        }).catch(this.setErrors.bind(this));
    }
};

module.exports = authentication;
