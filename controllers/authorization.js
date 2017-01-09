/**
 * @overview Authorization controller
 */

let Service = require('../model/services');

let lifx_api = "https://cloud.lifx.com/oauth";

let authorization = {

    authorize: function (req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Authorization.prepareRedirect(req.session, cache, resolve);
        });
    },

    /**
     * Retrieves information from LifX's redirect
     */
    redirect: function (req, cache) {
        return new Promise(function (resolve, reject) {
            Service.Authorization.authorizeUser({
                code: req.query.code,
                state: req.query.state
            }, req.session, cache, resolve);
        });
    }
};

module.exports = authorization;
