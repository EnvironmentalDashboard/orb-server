/**
 * Json controller
 */

let Service = require('../model/services');

let json = {
    orbInstructionList: function(req, cache) {
        return Service.DashboardInformation.initializeOrbInstructionsList(cache, req.session);
    }
};

module.exports = json;
