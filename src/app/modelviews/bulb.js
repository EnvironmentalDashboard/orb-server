let Service = require('../../model/services');

var bulb = {
    targetBulbSelector: null,

    setTargetBulb: function(id) {
        this.targetBulbSelector = id;
    },

    retrieveTargetBulb: function() {
        if(!this.targetBulbSelector) {
            return Promise.resolve();
        }

        let session = this.session,
            me = this;

        return Service.Bulb.retrieve(this.targetBulbSelector, session).catch(function(err) {
            return Service.BulbList.retrieve(session).then(function(bulbList) {
                return Promise.resolve({
                    attributes: {
                        selector: me.targetBulbSelector,
                        pulse_intensity: .2,
                        brightness: .6,
                        enabled: false,
                        integration: bulbList[me.targetBulbSelector].integration
                    }
                });
            });
        });
    },

    retrieveOrbList: function() {
        return Service.OrbList.retrieve(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = bulb;
