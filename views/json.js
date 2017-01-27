/**
 * Json view
 */

 let base = require('./base');

 let json = {
    orbInstructionList: function (req, res, next) {
        let instructionList = req.cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'application/json');
        res.json(instructionList);
    }

};

module.exports = json;
