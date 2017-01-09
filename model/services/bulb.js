/**
 * @overview Responsible for bulb services (saving)
 */

let validator = require('validator');

let Entity = require('../entities'),
    Recognition = require('./recognition');

let updateOrSaveBulb = function(selector, owner, enabled, orb) {
    return Entity.Bulb.where('selector', selector).fetch().then(function (match) {
        if (match) {
            return new Entity.Bulb({
                id: match.get('id'),
                owner: owner.id,
                enabled: enabled,
                orb: orb
            }, {patch: true}).save();
        } else {
            return new Entity.Bulb({
                selector: selector,
                owner: owner.id,
                enabled: enabled,
                orb: orb
            }).save();
        }
    });
}

let Bulb = {

    save: function(params, sess, reqCache, done) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        let selector = params.selector,
            enabled = params.enabled,
            orb = params.orb;

        if (orb != null && orb != "") {
            new Entity.Orb({id: orb}).fetch().then(function (match){
                if (!match || match.get('owner') !== client.id) {
                    return done();
                } else {
                    return updateOrSaveBulb(selector, client, enabled === "true", orb).then(function(){
                        done();
                    });
                }
            });
        } else {
            return updateOrSaveBulb(selector, client, enabled === "true", null).then(function(){
                done();
            });
        }
    }
};

module.exports = Bulb;
