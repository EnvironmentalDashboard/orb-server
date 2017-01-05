/**
 * @overview Handles application routing
 */

/**
 * @param  Object params Object literal with controllers, app, and views
 */

exports.setup = function (params) {

    let app = params.app,
        controllers = params.controllers;

    //Home
    app.get('/', controllers.pages.index);
};
