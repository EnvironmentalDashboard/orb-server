let Service = require('../../model/services');

var orb = {
    inputs: {
        daySets: [
            [1, 2, 3, 4, 5, 6, 7]
        ]
    },
    targetOrbId: null,

    setInputs: function(inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },

    setTargetOrb: function(id) {
        this.targetOrbId = id;
    },

    retrieveTargetOrb: function() {
        if (!this.targetOrbId) {
            return Promise.resolve();
        }

        return Service.OrbList.retrieve(this.targetOrbId, this.session).catch(this.setErrors.bind(this));
    },

    retrieveMeterList: function() {
        return Service.DashboardInformation.getMeterList(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = orb;
