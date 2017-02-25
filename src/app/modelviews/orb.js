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

        return Service.Orb.retrieve(this.targetOrbId, this.session).then(function(orb) {
            return Promise.resolve(Object.assign({}, orb.attributes, {
                meter1: orb.related('relativeValue1').get('meter_uuid'),
                meter2: orb.related('relativeValue2').get('meter_uuid')
            }));
        }).catch(this.setErrors.bind(this));
    },

    retrieveMeterList: function() {
        return Service.MeterList.retrieve(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = orb;
