/**
 * Router
 * @overview Handles application routing mechanisms
 */
let controllers = require('../controllers'),
    views = require('../views'),
    modelviews = require('../modelviews');

module.exports.import = function(routes, app) {
   routes.forEach(function(route) {
       /**
        * Validate route
        */
       if(!modelviews[route.resource]) {
           return Promise.reject('Missing modelview `'+ route.resource +'` ('+ route.pattern +')');
       }

       if(route.action.controller && !controllers[route.resource]) {
           return Promise.reject('Missing controller `'+ route.resource +'` ('+ route.pattern +')');
       }

       if(route.action.controller && !controllers[route.resource][route.action.controller]) {
           return Promise.reject('Invalid controller action `'+ route.action.controller +'` ('+ route.pattern +')');
       }

       if(route.action.view && !views[route.resource]) {
           return Promise.reject('Missing view `'+ route.resource +'` ('+ route.pattern +')');
       }

       if(route.action.view && !views[route.resource][route.action.view]) {
           return Promise.reject('Invalid view action `'+ route.action.view +'` ('+ route.pattern +')');
       }

       /**
        * Route wiring
        */
       var appmodel;

       app[route.method](route.pattern, function(req, res, next) {
           appmodel = new modelviews[route.resource];

           appmodel.setSession(req.session);

           if(!route.action || !route.action.controller) {
               return next();
           }

           return controllers[route.resource][route.action.controller](req, appmodel).then(function() {
               return next();
           }).catch(console.log.bind(console));
       });

       app[route.method](route.pattern, function(req, res, next) {
           return views[route.resource][route.action.view](res, appmodel);
       });
   });
};
