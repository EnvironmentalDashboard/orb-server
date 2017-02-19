let Service = require('../../model/services');

let defaultController = {
    index: function(req, appmodel) {
        return Promise.resolve();
    }
};

module.exports = defaultController;
