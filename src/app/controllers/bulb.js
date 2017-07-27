let Service = require('../../model/services');

let bulbController = {
    configure: function(req, appmodel) {
        let params = {
            selector: req.body.selector,
            integration: req.body.integration,
            enabled: req.body.enabled,
            orb: req.body.orb,
            pulse_intensity: req.body.pulse_intensity,
            brightness: req.body.brightness
        };


        appmodel.setTargetBulb(req.params.bulbId);

        return Service.Bulb.save(params, req.session).catch(console.log.bind(console));
    },

    load: function(req, appmodel) {
        appmodel.setTargetBulb(req.params.bulbId);
        return Promise.resolve();
    }
};

module.exports = bulbController;
