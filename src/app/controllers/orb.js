let Service = require('../../model/services');

let orbController = {
    configure: function(req, appmodel) {
        let sampleSizes = new Array(7).fill(req.body.sample || 5);

        if (req.body.customGroupings) {
            console.log('using custom!');
            sampleSizes = [
                req.body.samplesize_0 || '5',
                req.body.samplesize_1 || '5',
                req.body.samplesize_2 || '5',
                req.body.samplesize_3 || '5',
                req.body.samplesize_4 || '5',
                req.body.samplesize_5 || '5',
                req.body.samplesize_6 || '5'
            ];
        }

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
            sampleSizes: sampleSizes
        };

        appmodel.setInputs(req.body);
        appmodel.setTargetOrb(req.params.orbId);

        return Service.Orb.save(params, req.session).catch(appmodel.setErrors.bind(appmodel));
    },

    load: function(req, appmodel) {
        appmodel.setTargetOrb(req.params.orbId).catch(appmodel.setErrors.bind(appmodel));
        return Promise.resolve();
    },

    delete: function(req, appmodel) {
        return Service.Orb.delete(req.params.orbId, req.session).catch(appmodel.setErrors.bind(appmodel));
    }
};

module.exports = orbController;
