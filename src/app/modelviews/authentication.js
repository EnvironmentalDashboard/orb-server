let Service = require('../../model/services'),
    modelview = require('./modelview');

var authentication = modelview({
    inputs: null,

    setInputs: function (inputs) {
        this.inputs = inputs;
    },
    getInputs: function() {
        return this.inputs;
    }
});

module.exports = authentication;
