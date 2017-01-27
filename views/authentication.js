/**
 * Authentication view - blah
 */

let authentication = {
    signin: function (req, res, next) {

        req.cache.get('errors', function (err, val) {
            /**
             * If there were errors
             */
            if (val !== undefined) {

                res.render('login', {
                    errors: val
                });


            } else {
                res.redirect('/dash');
            }
        });

    },

    signout: function (req, res, next) {
        if(!req.cache.get('loggedIn')) {
            res.render('logout-success');
        } else {
            res.render('bad-request', {loggedIn: req.cache.get('loggedIn') });
        }

    },

};

module.exports = authentication;
