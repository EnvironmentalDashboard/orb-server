/**
 * @overview Contains and manages current user for program
 */

/* Creates a variable with access to all modules inside "services" folder */
let Service = require('../../model/services');

/** Contains information of current session
 * @name modelview
 * @type {Object}
 */
let modelview = {
    session: {},
    errors: false,

    /** @property {function} setSession sets global session variable to parameter value
     *  @param session
     */
    setSession: function(session) {
        this.session = session;
    },

    /** @property {function} getAuthenticatedUser
     */
    getAuthenticatedUser: function() {
        return Service.Recognition.knowsClient(this.session);
    },

    /** @property {function} getAuthError
     */
    getAuthError: function() {
        return this.errors && this.errors.authError;
    },

    /** @property {function} setErrors
     */
    setErrors: function(errors) {
        this.errors = errors;
    },

    /** @property {function} getErrors returns status of errors in current session model
     *  @return {Boolean}
     */
    getErrors: function() {
        return this.errors;
    }

};

// Exporting object childObj using information assigned in modelview variable and information in childAttrs
module.exports = function(childAttrs) {
    let childObj = function() {};
    // object.prototype allows you to add new properties to object constructors without having to add it to the object structure
    // Adds the attributions of the modelview and the childAttrs to the childObj created and then is exported to be used by other files
    childObj.prototype = Object.assign({}, modelview, childAttrs);

    return childObj;
};
