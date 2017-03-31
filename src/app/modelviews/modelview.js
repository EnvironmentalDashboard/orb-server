let Service = require('../../model/services');

let modelview = {
    session: {},
    errors: false,

    setSession: function(session) {
        this.session = session;
    },

    getAuthenticatedUser: function() {
        return Service.Recognition.knowsClient(this.session);
    },

    getAuthError: function() {
        return this.errors && this.errors.authError;
    },

    setErrors: function(errors) {
        console.log("before: " + errors);
        this.errors = errors;
        console.log("after: " + this.errors);
    },
    
    getErrors: function() {
        console.log("got errors: " +this.errors);
        return this.errors;
    }

};

module.exports = function(childAttrs) {
    let childObj = function() {};
    childObj.prototype = Object.assign({}, modelview, childAttrs);

    return childObj;
};
