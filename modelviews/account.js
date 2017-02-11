let Service = require('../model/services'),
    modelview = require('./modelview');

var account = modelview({
    inputs: {},
    
    setInputs: function (inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },
});

module.exports = account;
