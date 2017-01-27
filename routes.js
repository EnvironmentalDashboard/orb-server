/**
 * Routes
 * @overview Handles application routing mechanisms
 */
let controllers = require('./controllers'),
    views = require('./views');

/**
 * @param  Object params An Oject literal with controllers and app
 */
module.exports.initialize = function (app) {
    // Home
    app.get('/', controllers.page.index, views.page.index);
    app.get('/guide', controllers.page.guide, views.page.guide);

    // Dashboard
    app.get('/dash', controllers.page.dashboard, views.page.dashboard);

    app.get('/dash/orb/new', controllers.page.newOrb, views.page.newOrb);
    app.post('/dash/orb/new', controllers.configuration.insertOrb, views.configuration.orb);

    app.get('/dash/orb/delete/:orbId', controllers.page.deleteOrb, views.page.deleteOrb);
    app.post('/dash/orb/delete/:orbId', controllers.configuration.deleteOrb, views.configuration.deleteOrb);

    app.get('/dash/orb/edit/:orbId', controllers.page.editOrb, views.page.editOrb);
    app.post('/dash/orb/edit/:orbId', controllers.configuration.updateOrb, views.configuration.orb);

    app.get('/dash/orb/success', controllers.page.orbSuccess, views.page.orbSuccess);

    app.post('/dash/bulb/update', controllers.configuration.bulb, views.configuration.bulb);

    // Account configuration
    app.get('/account', controllers.page.account, views.page.account);

    app.get('/account/config', controllers.page.accountConfig, views.page.accountConfig);
    app.post('/account/config', controllers.account.update, views.account.update);

    app.get('/account/config/success', controllers.page.accountConfigSuccess, views.page.accountConfigSuccess);

    app.get('/account/security', controllers.page.securityConfig, views.page.securityConfig);
    app.post('/account/security', controllers.account.updatePassword, views.account.updatePassword);

    app.get('/account/security/success', controllers.page.accountConfigSuccess, views.page.accountConfigSuccess);

    // Recognnition
    app.get('/account/signin', controllers.page.signin, views.page.signin);
    app.post('/account/signin', controllers.authentication.signin, views.authentication.signin);
    app.get('/account/signout', controllers.authentication.signout, views.authentication.signout);

    // Registration
    //
    // Notice: 'signup' on the frontend (i.e., URLs and page controller name) and
    // 'register' on the backend
    app.get('/account/signup', controllers.page.signup, views.page.signup);
    app.post('/account/signup', controllers.account.register, views.account.register);
    app.get('/account/signup/success', controllers.page.signupSuccess, views.page.signupSuccess);

    // Authorization
    app.get('/auth', controllers.authorization.authorize, views.authorization.authorize);
    app.get('/auth/confirm', controllers.page.authConfirm, views.page.authConfirm);
    app.get('/redirect', controllers.authorization.redirect, views.authorization.redirect);

    // JSON pages
    app.get('/json/orb/instructions', controllers.json.orbInstructionList, views.json.orbInstructionList);

    // Dynamic CSS
    app.get('/css/orbs.animation.css', controllers.json.orbInstructionList, views.css.orbAnimations);

};
