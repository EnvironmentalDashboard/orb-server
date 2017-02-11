let guideView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('guide', {
            loggedIn: loggedIn
        });
    }
};

module.exports = guideView;
