/**
 * Authorization view
 */

 let base = require('./base');

let lifx_api = "https://cloud.lifx.com/oauth";

let authorization = {
    authorize: function (req, res, next) {
        if(base.caughtAuthError(req.cache)) {
            return res.render('denied');
        }

        let query = req.cache.get('query');

        res.redirect(lifx_api + '/authorize?' + query);

    },

    redirect: function (req, res, next) {
        if(base.caughtAuthError(req.cache)) {
            return res.render('denied');
        }

        return res.render('auth-success', {loggedIn: req.cache.get('loggedIn')});
    }

};

module.exports = authorization;
