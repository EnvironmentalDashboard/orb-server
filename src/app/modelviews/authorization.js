let Service = require('../../model/services');

var authentication = {
    integration: null,
    inputs: null,
    redirectAddress: null,

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
    }
};

module.exports = authentication;
