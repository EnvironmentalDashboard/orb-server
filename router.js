/**
 * Router
 * @overview Handles application routing mechanisms
 */
let controllers = require('./controllers'),
    views = require('./views');

/**
 * Holds all application routes
 * @type {Array}
 */
 var routes = [
     ['get', '/', [controllers.page.index, views.page.index]],
     ['get', '/guide', [controllers.page.guide, views.page.guide]],

     // Dashboard
     ['get', '/dash', [controllers.page.dashboard, views.page.dashboard]],

     ['get', '/dash/orb/new', [controllers.page.newOrb, views.page.newOrb]],
     ['post', '/dash/orb/new', [controllers.configuration.insertOrb, views.configuration.orb]],

     ['get', '/dash/orb/delete/:orbId', [controllers.page.deleteOrb, views.page.deleteOrb]],
     ['post', '/dash/orb/delete/:orbId', [controllers.configuration.deleteOrb, views.configuration.deleteOrb]],

     ['get', '/dash/orb/edit/:orbId', [controllers.page.editOrb, views.page.editOrb]],
     ['post', '/dash/orb/edit/:orbId', [controllers.configuration.updateOrb, views.configuration.orb]],

     ['get', '/dash/orb/success', [controllers.page.orbSuccess, views.page.orbSuccess]],

     ['post', '/dash/bulb/update', [controllers.configuration.bulb, views.configuration.bulb]],

     // Account configuration
     ['get', '/account', [controllers.page.account, views.page.account]],

     ['get', '/account/config', [controllers.page.accountConfig, views.page.accountConfig]],
     ['post', '/account/config', [controllers.account.update, views.account.update]],

     ['get', '/account/config/success', [controllers.page.accountConfigSuccess, views.page.accountConfigSuccess]],

     ['get', '/account/security', [controllers.page.securityConfig, views.page.securityConfig]],
     ['post', '/account/security', [controllers.account.updatePassword, views.account.updatePassword]],

     ['get', '/account/security/success', [controllers.page.accountConfigSuccess, views.page.accountConfigSuccess]],

     // Recognnition
     ['get', '/account/signin', [controllers.page.signin, views.page.signin]],
     ['post', '/account/signin', [controllers.authentication.signin, views.authentication.signin]],
     ['get', '/account/signout', [controllers.authentication.signout, views.authentication.signout]],

     // Registration
     //
     // Notice: 'signup' on the frontend (i.e., URLs and page controller name) and
     // 'register' on the backend
     ['get', '/account/signup', [controllers.page.signup, views.page.signup]],
     ['post', '/account/signup', [controllers.account.register, views.account.register]],
     ['get', '/account/signup/success', [controllers.page.signupSuccess, views.page.signupSuccess]],

     // Authorization
     ['get', '/auth', [controllers.authorization.authorize, views.authorization.authorize]],
     ['get', '/auth/confirm', [controllers.page.authConfirm, views.page.authConfirm]],
     ['get', '/redirect', [controllers.authorization.redirect, views.authorization.redirect]],

     // JSON pages
     ['get', '/json/orb/instructions', [controllers.json.orbInstructionList, views.json.orbInstructionList]],

     // Dynamic CSS
     ['get', '/css/orbs.animation.css', [controllers.json.orbInstructionList, views.css.orbAnimations]]
 ];

 module.exports.initialize = function(app) {
     routes.forEach(function(params) {
         [method, route, handlers] = params;

         handlers.splice(1, 0, function(req, res, next) {
             if(req.cache.get('auth-error')) {
                 return res.render('denied');
             }

             next();
         });

         app[method](route, handlers);
     })
 };
