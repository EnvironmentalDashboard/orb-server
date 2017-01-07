/**
 * Page view
 */

let page = {
    index: function(res, cache) {

        res.render('default');
    },

    signup: function(res, cache) {

        res.render('register');
    },

    signupSuccess: function(res, cache) {

        res.render('register-success');
    }
};

module.exports = page;
