/**
 * Routes
 * @overview Handles application routing mechanisms
 */

let NodeCache = require('node-cache');

/**
 * Routes a controller and view together
 * @param  {Array} components Functions to pass req, res to
 */
let pair = function (controller, view) {
    return function(req, res) {
        /**
         * Create cache for this request
         */
        let reqCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

        /**
         * Route request; pass request object to controller, response object to
         * the view, and pass both the request cache.
         *
         * This way, the controller may pass any services the request cache for
         * the service to manipulate. The view will be able to chekc the request
         * cache as insight into the model's state.
         */

        controller(req, reqCache).then(function(){
            return view(res, reqCache);
        });
    };
};

/**
 * @param  Object params An Oject literal with controllers and app
 */
module.exports.setup = function (params) {

    let app = params.app,
        controllers = params.controllers,
        views = params.views;

    // Home
    app.get('/', pair(controllers.page.index, views.page.index.bind(views.page)));

    // Dashboard
    app.get('/dash', pair(controllers.page.dashboard, views.page.dashboard.bind(views.page)));
    app.get('/dash/orb/new', pair(controllers.page.neworb, views.page.neworb.bind(views.page)));

    // Authentication
    app.get('/account/signin', pair(controllers.page.signin, views.page.signin));
    app.post('/account/signin', pair(controllers.authentication.signin, views.authentication.signin));

    // Registration
    //
    // Notice: 'signup' on the frontend (i.e., URLs and page controller name) and
    // 'register' on the backend
    app.get('/account/signup', pair(controllers.page.signup, views.page.signup));
    app.post('/account/signup', pair(controllers.account.register, views.account.register));
    app.get('/account/signup/success', pair(controllers.page.signupSuccess, views.page.signupSuccess));

    /*/ Authorization
    app.get('/auth', controllers.authorization.authorize);
    app.get('/redirect', controllers.authorization.redirect);*/

};
