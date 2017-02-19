let Service = require('../../model/services');

var authentication = {
    inputs: null,

    setInputs: function(inputs) {
        this.inputs = inputs;
    },
    getInputs: function() {
        return this.inputs;
    }
};

module.exports = authentication;
