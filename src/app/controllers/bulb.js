let Service = require('../../model/services');

let bulbController = {
    update: function(req, appmodel) {
        let params = {
            selector: req.body.selector,
            enabled: req.body.enabled,
            orb: req.body.orb
        };

        return Service.Bulb.save(params, req.session);
    }
};

module.exports = bulbController;
