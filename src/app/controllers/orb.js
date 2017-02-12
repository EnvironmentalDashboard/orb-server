let Service = require('../../model/services');

let orbController = {
    configure: function (req, appmodel) {
        let params = {
            id: req.params.orbId,
            title: req.body.title,
            meter1: req.body.meter1,
            meter2: req.body.meter2,
            daySets: [
                req.body.day_0 || '0',
                req.body.day_1 || '0',
                req.body.day_2 || '0',
                req.body.day_3 || '0',
                req.body.day_4 || '0',
                req.body.day_5 || '0',
                req.body.day_6 || '0'
            ],
            sampleSize: req.body.sample
        };

        appmodel.setInputs(req.body);
        appmodel.setTargetOrb(req.params.orbId);

        return Service.Orb.save(params, req.session).catch(function (errors) {
            appmodel.setErrors(errors);
        });
    },

    load: function(req, appmodel) {
        appmodel.setTargetOrb(req.params.orbId);
        return Promise.resolve();
    },

    delete: function(req, appmodel) {
        return Service.Orb.delete(req.params.orbId, req.session);
    }
};

module.exports = orbController;
