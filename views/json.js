/**
 * Json view
 */

 let base = require('./base');

 let json = {
    orbInstructionList: function (req, res, next) {
        if(base.caughtAuthError(req.cache)) {
            return res.send('Denied.');
        }

        let instructionList = req.cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'application/json');
        res.json(instructionList);
    }

};

module.exports = json;
