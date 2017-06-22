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

    retrieveBuildingDataIntegration: function() {
        return Service.BuildingDataIntegration.retrieve(this.session).catch(this.setErrors.bind(this));
    }

};

module.exports = account;
