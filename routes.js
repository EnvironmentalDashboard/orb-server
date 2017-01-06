/**
 * @overview Handles application routing
 */

/**
 * @param  Object params An Oject literal with controllers and app
 */
module.exports.setup = function (params) {

    let app = params.app,
        controllers = params.controllers;

    //Home
    app.get('/', controllers.pages.index);

    //Authentication
    app.get('/auth', controllers.authentication.authenticate);
    app.get('/redirect', controllers.authentication.redirect);

};
