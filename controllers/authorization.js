/**
 * @overview Authorization controller
 */

let Service = require('../model/services');

let authorization = {

    authorize: function (req, cache) {
        return Service.Account.authorizationRedirect(req.session, cache);
    },

    /**
     * Retrieves information from LifX's redirect
     */
    redirect: function (req, cache) {
        return Service.Account.authorize({
            code: req.query.code,
            state: req.query.state
        }, req.session, cache);
    }
};

module.exports = authorization;
