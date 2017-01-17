/**
 * Json view
 */

 let base = require('./base');

 let json = Object.assign(base, {
    orbInstructionList: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.send('Denied.');
        }

        let instructionList = cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(instructionList));
    }

});

module.exports = json;
