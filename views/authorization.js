/**
 * Authorization view
 */

 let base = require('./base');

let lifx_api = "https://cloud.lifx.com/oauth";

let authorization = Object.assign(base, {
    authorize: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        let query = cache.get('query');

        res.redirect(lifx_api + '/authorize?' + query);

    },

    redirect: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        return res.render('auth-success', {loggedIn: cache.get('loggedIn')});
    }

});

module.exports = authorization;
