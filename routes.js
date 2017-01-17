/**
 * Routes
 * @overview Handles application routing mechanisms
 */

let NodeCache = require('node-cache');

let Service = require('./model/services');

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
         * Initialize authorization and attempt to recognize client
         */
        Service.Recognition.knowsClient(req.session, reqCache);

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
    app.get('/guide', pair(controllers.page.guide, views.page.guide.bind(views.page)));

    // Dashboard
    app.get('/dash', pair(controllers.page.dashboard, views.page.dashboard.bind(views.page)));
    app.get('/dash/orb/new', pair(controllers.page.neworb, views.page.neworb.bind(views.page)));
    app.post('/dash/orb/new', pair(controllers.dashboard.createOrb, views.dashboard.createOrb.bind(views.dashboard)));
    app.get('/dash/orb/success', pair(controllers.page.orbSuccess, views.page.orbSuccess.bind(views.page)));
    app.post('/dash/bulb/update', pair(controllers.dashboard.updateBulb, views.dashboard.updateBulb.bind(views.dashboard)));

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

    // Authorization
    app.get('/auth', pair(controllers.authorization.authorize, views.authorization.authorize.bind(views.authorization)));
    app.get('/auth/confirm', pair(controllers.page.authConfirm, views.page.authConfirm.bind(views.page)));
    app.get('/redirect', pair(controllers.authorization.redirect, views.authorization.redirect.bind(views.authorization)));

    // JSON pages
    app.get('/json/orb/instructions', pair(controllers.json.orbInstructionList, views.json.orbInstructionList.bind(views.json)));

    // Dynamic CSS
    app.get('/css/orbs.animation.css', pair(controllers.json.orbInstructionList, views.css.orbAnimations.bind(views.css)));

};
