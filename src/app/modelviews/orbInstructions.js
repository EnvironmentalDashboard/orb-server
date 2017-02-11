let Service = require('../../model/services');

var orbInstructions = {
    inputs: {daySets: [[1,2,3,4,5,6,7]]},
    targetOrbId: null,

    retrieveInstructions: function() {
        return Service.Orb.retrieveInstructionsList(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = orbInstructions;
