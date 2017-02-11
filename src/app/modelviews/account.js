let Service = require('../../model/services');

var account = {
    inputs: {},

    setInputs: function (inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },
};

module.exports = account;
