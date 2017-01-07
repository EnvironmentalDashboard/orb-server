/**
 * Page view
 */

let page = {
    index: function(res, cache) {

        res.render('default');
    },

    signup: function(res, cache) {

        res.render('register');
    }
};

module.exports = page;
