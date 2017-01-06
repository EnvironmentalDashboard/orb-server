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

    //Authorization
    app.get('/auth', controllers.authorization.authorize);
    app.get('/redirect', controllers.authorization.redirect);

    //Authentication

};
