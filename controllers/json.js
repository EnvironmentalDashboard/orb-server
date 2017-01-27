/**
 * Json controller
 */

let Service = require('../model/services');

let json = {
    orbInstructionList: function(req, res, next) {
        return Service.DashboardInformation
            .initializeOrbInstructionsList(req.cache, req.session)
            .then(function() {
                next();
            });
    }
};

module.exports = json;
