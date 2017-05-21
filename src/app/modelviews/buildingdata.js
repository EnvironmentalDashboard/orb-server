let Service = require('../../model/services');

var data = {
    inputs: {},

    setInputs: function(inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    }
};

module.exports = data;
