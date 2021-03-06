let guideView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('guide', {
            loggedIn: loggedIn,
            page: {
                active: { guide: true }
            }
        });
    }
};

module.exports = guideView;
