let orbInstructionsView = {
    css: function (res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            orbInstructionsPromise = appmodel.retrieveInstructions();


        return orbInstructionsPromise.then(function (instructions) {
            if(appmodel.getAuthError()) {
                return res.render('denied');
            }

            res.setHeader('Content-Type', 'text/css');
            return res.render('css/orb.animation.css.hbs', {
                instructions: instructions,
                timestamp: new Date(),
                layout: false
            });
        });
    },

    json: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            orbInstructionsPromise = appmodel.retrieveInstructions();

        return orbInstructionsPromise.then(function (instructions) {
            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

                res.setHeader('Content-Type', 'application/json');
                return res.json(instructions);
        });
    }
};

module.exports = orbInstructionsView;
