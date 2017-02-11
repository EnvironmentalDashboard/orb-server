let Service = require('../../model/services'),
    modelview = require('./modelview');

var orbInstructions = modelview({
    inputs: {daySets: [[1,2,3,4,5,6,7]]},
    targetOrbId: null,

    retrieveInstructions: function() {
        return Service.DashboardInformation.getOrbInstructionsList(this.session).catch(this.setErrors.bind(this));
    }
});

module.exports = orbInstructions;
