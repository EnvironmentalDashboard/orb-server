let Service = require('../../model/services');

var integration = {

    retrieveIntegrationList: function() {
        return Service.BulbIntegrationList.retrieve(this.session).catch(this.setErrors.bind(this));
    },

    retrieveBuildingDataIntegration: function() {
        return Service.BuildingDataIntegration.retrieve(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = integration;
