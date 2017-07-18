let Service = require('../../model/services');

var orb = {
    inputs: {},
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

        let meter1 = {},
            meter2 = {},
            orb;

        let session = this.session;

        return Service.Orb.retrieve(this.targetOrbId, session).then(function(retrievedOrb) {
            orb = retrievedOrb;

            return Service.Meter.retrieve(orb.related('relativeValue1').get('meter_uuid'), session);
        }).then(function(retrievedMeter) {
            meter1 = {
                meter1Org: retrievedMeter.get('org_id'),
                meter1Building: retrievedMeter.get('building_id'),
                meter1: retrievedMeter.get('bos_uuid')
            };

            if(!orb.related('relativeValue2')) {
                return Promise.resolve(false);
            }

            return Service.Meter.retrieve(orb.related('relativeValue2').get('meter_uuid'), session);
        }).then(function(retrievedMeter) {
            if(retrievedMeter) {
                meter2 = {
                    meter2Org: retrievedMeter.get('org_id'),
                    meter2Building: retrievedMeter.get('building_id'),
                    meter2: retrievedMeter.get('bos_uuid')
                };
            }

            /**
             * Combine all orb info into one object
             */
            let orbData = Object.assign({}, orb.attributes, {
                daySets: JSON.parse(orb.related('relativeValue1').get('grouping'))
            }, meter1, meter2);


            return Promise.resolve(orbData);
        }).catch(this.setErrors.bind(this));
    },

    retrieveMeterList: function() {
        return Service.MeterList.retrieve(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = orb;
