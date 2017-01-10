/**
 * Account view
 */

let account = {
    register: function (res, cache) {

        cache.get('errors', function (err, val) {
            /**
             * If there were errors, render the registration page again
             */
            if (val !== undefined) {
                res.render('register', {
                    loggedIn: cache.get('loggedIn'),
                    errors: val,
                    form: cache.get('form')
                });

            /**
             * Otherwise registration was a success
             */
            } else {
                res.redirect('/account/signup/success');
            }
        });

    },

};

module.exports = account;