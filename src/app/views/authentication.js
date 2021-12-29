/**
 * @overview Authorization file that manages views for user based on Login status
**/

/** Creates authenticationView variable for login and logout views **/
let authenticationView = {

    // Function that controls and manages when a user is logged in
    login: function(res, appmodel) {

        // sets variables to associated values using methods located in modelview.js
        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors(),
            form = appmodel.getInputs();

        if (loggedIn) {
            return res.redirect('/dash');
        }

        return res.render('login', {
            loggedIn: loggedIn,
            errors: errors,
            form: form,
            page: {
                active: { signin: true },
                title: "Login"
            }
        });
    },

    // Function that controls and manages when a user is not logged in
    logout: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (loggedIn) {
            //Something went wrong...
            return res.render('bad-request', {
                loggedIn: loggedIn,
                page: {
                    title: "Bad Request"
                }
            });
        }

        return res.render('logout-success', {
            page: {
                title: "Logged Out"
            }
        });
    }
};

module.exports = authenticationView;
