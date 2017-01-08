/**
 * Dashboard view
 */

 let base = require('./base');

 let dashboard = Object.assign(base, {
    createOrb: function (res, cache) {

        console.log('prior');

        if(this.caughtAuthError(cache)) {
            return res.render('denied');
        }

        cache.get('errors', function (err, val) {

            let meterList = cache.get('meter-list');
            console.log('checking...');
            /**
             * If there were errors, render the orb creation page again
             */
            if (val !== undefined) {
                console.log('erro!');
                res.render('addorb', {
                    errors: val,
                    form: cache.get('form'),
                    buildings: meterList
                });

            /**
             * Otherwise orb creation was a success
             */
            } else {
                console.log('freeoferr!');
                res.redirect('/dash/orb/success');
            }
        });

    },

});

module.exports = dashboard;
