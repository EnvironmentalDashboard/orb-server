/**
 * Authorization controller
 */

let Service = require('../model/services');

let authorization = {

    authorize: function (req, res, next) {
        return Service.Account.authorizationRedirect(req.cache, req.session)
            .then(function() {
                next();
            });
    },

    /**
     * Retrieves information from LifX's redirect
     */
    redirect: function (req, res, next) {
        return Service.Account.authorize({
            code: req.query.code,
            state: req.query.state
        }, req.cache, req.session).then(function() {
            next();
        });
    }
};

module.exports = authorization;
