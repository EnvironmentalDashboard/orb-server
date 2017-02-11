/**
 * Router
 * @overview Handles application routing mechanisms
 */
let controllers = require('./controllers'),
    views = require('./views'),
    modelviews = require('./modelviews');

/**
 * Holds all application routes
 * @type {Array}
 */
 var routes = [
    ['get', '/', [Promise.resolve.bind(Promise), views.default.index], modelviews.default],
    ['get', '/guide', [Promise.resolve.bind(Promise), views.guide.index], modelviews.guide],

    // Dashboard
    ['get', '/dash', [controllers.dashboard.index, views.dashboard.index], modelviews.dashboard],

    ['get', '/dash/orb/new', [Promise.resolve.bind(Promise), views.orb.configure], modelviews.orb],
    ['post', '/dash/orb/new', [controllers.orb.save, views.orb.configure], modelviews.orb],

    ['get', '/dash/orb/delete/:orbId', [controllers.orb.load, views.orb.deletePrompt], modelviews.orb],
    ['post', '/dash/orb/delete/:orbId', [controllers.orb.delete, views.orb.delete], modelviews.orb],

    ['get', '/dash/orb/edit/:orbId', [controllers.orb.load, views.orb.configure], modelviews.orb],
    ['post', '/dash/orb/edit/:orbId', [controllers.orb.save, views.orb.configure], modelviews.orb],

    ['get', '/dash/orb/success', [Promise.resolve.bind(Promise), views.orb.success], modelviews.orb],

    ['post', '/dash/bulb/update', [controllers.bulb.update, views.bulb.update], modelviews.bulb],

    // Account configuration
    ['get', '/account', [controllers.account.index, views.account.index], modelviews.account],

    ['get', '/account/config', [controllers.account.index, views.account.config], modelviews.account],
    ['post', '/account/config', [controllers.account.config, views.account.config], modelviews.account],

    ['get', '/account/security', [Promise.resolve.bind(Promise), views.account.updatePassword], modelviews.account],
    ['post', '/account/security', [controllers.account.updatePassword, views.account.updatePassword], modelviews.account],

    ['get', '/account/config/success', [controllers.account.success, views.account.success], modelviews.account],
    ['get', '/account/security/success', [controllers.account.success, views.account.success], modelviews.account],

    // Registration
    ['get', '/account/signup', [Promise.resolve.bind(Promise), views.account.register], modelviews.account],
    ['post', '/account/signup', [controllers.account.register, views.account.register], modelviews.account],
    ['get', '/account/signup/success', [Promise.resolve.bind(Promise), views.account.registerSuccess], modelviews.account],

    // Recognnition
    ['get', '/account/signin', [Promise.resolve.bind(Promise), views.authentication.login], modelviews.authentication],
    ['post', '/account/signin', [controllers.authentication.login, views.authentication.login], modelviews.authentication],
    ['get', '/account/signout', [controllers.authentication.logout, views.authentication.logout], modelviews.authentication],

    // Authorization
    ['get', '/auth/confirm', [Promise.resolve.bind(Promise), views.authorization.confirm], modelviews.authorization],
    ['get', '/auth/go', [controllers.authorization.authorize, views.authorization.authorize], modelviews.authorization],
    ['get', '/redirect', [controllers.authorization.redirect, views.authorization.redirect], modelviews.authorization],

    // JSON pages
    ['get', '/orb-instructions/json', [Promise.resolve.bind(Promise), views.orbInstructions.json], modelviews.orbInstructions],

    // Dynamic CSS
    ['get', '/orb-instructions/animations.css', [Promise.resolve.bind(Promise), views.orbInstructions.css], modelviews.orbInstructions]
 ];

 module.exports.initialize = function(app) {
    routes.forEach(function(params) {
        [method, route, [controller, view], modelview] = params;

        (function(modelview, view, controller){
            var appmodel;

            app[method](route, function(req, res, next) {
                appmodel = new modelview;

                if(typeof appmodel.setSession === "function") {
                    appmodel.setSession(req.session);
                }

                return controller(req, appmodel).then(function() {
                    return next();
                }).catch("Controller rejected: " + console.log);
            });

            app[method](route, function(req, res, next) {
                return view(res, appmodel);
            })
        }(modelview, view, controller));
    });
 };
