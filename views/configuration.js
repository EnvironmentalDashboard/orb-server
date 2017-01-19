/**
 * Dashboard view
 */

 let base = require('./base');

 let configuration = Object.assign(base, {
    orb: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        cache.get('errors', function (err, val) {

            let meterList = cache.get('meter-list');

            /**
             * If there were errors, render the orb creation page again
             */
            if (val !== undefined) {
                res.render('addorb', {
                    loggedIn: cache.get('loggedIn'),
                    errors: val,
                    form: cache.get('form'),
                    buildings: meterList
                });

            /**
             * Otherwise orb creation was a success
             */
            } else {
                res.redirect('/dash/orb/success');
            }
        });

    },

    bulb: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        res.redirect('/dash');
    }

});

module.exports = configuration;
