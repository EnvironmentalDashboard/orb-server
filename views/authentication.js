/**
 * Authentication view
 */

let authentication = {
    signin: function (res, cache) {

        cache.get('errors', function (err, val) {
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
