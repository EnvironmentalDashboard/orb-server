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

};

module.exports = authentication;
