let defaultView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('default', {
            loggedIn: loggedIn
        });
    }
};

module.exports = defaultView;
