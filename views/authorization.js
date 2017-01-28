/**
 * Authorization view
 */

let lifx_api = "https://cloud.lifx.com/oauth";

let authorization = {
    authorize: function (req, res, next) {
        let query = req.cache.get('query');

        res.redirect(lifx_api + '/authorize?' + query);

    },

    redirect: function (req, res, next) {
        return res.render('auth-success', {
            active: {account: true},
            loggedIn: req.cache.get('loggedIn')
        });
    }

};

module.exports = authorization;
