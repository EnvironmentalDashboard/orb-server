let Entity = require('../entities'),
    OrbEmulator = require('./orbemulator'),
    BulbInstructionDispatcher = require('./bulbinstructiondispatcher');

let SimulateBulbOrbs = function () {
    Entity.Bulb.collection().query('where', 'enabled', '=', 1).fetch({withRelated:['orb']})
    .then(function (bulbs) {
        bulbs.forEach(function (bulb) {
            OrbEmulator(bulb.relations.orb).then(function (instructions) {
                return BulbInstructionDispatcher(instructions, bulb.get('selector'));
            });
        });
    });
};

module.exports = SimulateBulbOrbs;
