let Service = require('../../model/services');

var authentication = {
    inputs: null,
    queryString: null,

    setInputs: function (inputs) {
        this.inputs = inputs;
    },

    getInputs: function() {
        return this.inputs;
    },

    setQueryString: function (queryString) {
        this.queryString = queryString;
    },

    getQueryString: function (queryString) {
        return this.queryString;
    }
};

module.exports = authentication;
