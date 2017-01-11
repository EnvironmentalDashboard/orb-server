/**
 * @overview Responsible for account services
 */

let querystring = require('querystring'),
    request = require('request'),
    validator = require('validator'),
    sodium = require('sodium').api;

let Entity = require('../entities'),
    Recognition = require('./recognition');

let lifx_api = "https://cloud.lifx.com/oauth";

/**
 * Deprecate this...
 */
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

let Account = {

    register: function (params, reqCache, done) {

        /**
         * Validation
         */

        let email = params.email.trim(),
            fname = params.fname.trim(),
            lname = params.lname.trim(),
            password1 = params.password1,
            password2 = params.password2;

        /**
         * Need to keep track of errors
         * @type {Object}
         */
        let errors = {};

        /**
         * Set a resolve function to store the errors in the request cache
         * before calling the done callback, only if there are errors.
         */
        let resolve = function() {
            if(Object.keys(errors).length !== 0) {
                reqCache.set('errors', errors);
                reqCache.set('form', {
                    email: email,
                    fname: fname,
                    lname: lname
                });
            }

            done();
        };

        // Name must be alphanumeric
        if ((!fname.match(/^[0-9a-z ]+$/i) && fname.length !== 0)
            || (!lname.match(/^[0-9a-z ]+$/i) && lname.length !== 0)) {
            errors.name = ['Name fields must be alphanumeric (0-9a-Z).'];
        }

        // Passwords must match
        if (password1 != password2) {
            errors.password = ['Passwords must match.'];

        // Passwords have minlneghth 5
        } else if (password1.length < 5) {
            errors.password = ['Password too short (5 characters minimum).'];
        }

        // Invalid email
        if (!validator.isEmail(email)) {
            errors.email = ['Email not valid'];

            // We don't need to check if the email is already taken in the case
            // that the email is invalid. So just resolve here
            return resolve();
        }

        /**
         * Resolve if email is already taken or there exists other errors
         * @param {[type]} {email: email} [description]
         */
        new Entity.User({email: email}).fetch().then(function (match) {
            if (match) {
                errors.email = ['This email already exists in our database.'];
            }

            if(Object.keys(errors).length !== 0) {
                return resolve();
            }

            /**
             * Save to the database if you've made it this far
             */

            let pwdBuffer = Buffer.from(password1);

            let hash = Buffer.from(sodium.crypto_pwhash_argon2i_str(
                pwdBuffer,
                sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
            ));

            new Entity.User({
                email: email,
                lname: lname,
                fname: fname,
                password: hash
            }).save().then(function() {
                return resolve();
            });

        });
    },

    authorizationRedirect: function(sess, reqCache, done) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        /**
         * Random, unguessable string to prevent CSS attacks: base64 encodes the
         * timestamp multipled by a psuedorandom decimal (0-1) and removes non-
         * alphanumerics
         * @type {String}
         */
        let state = (Buffer.from(''+(Math.random() * +new Date())).toString('base64'))
            .replace(/[^0-9a-z]/gi, '');

        sess.request_state = state;

        let query = querystring.stringify({
            client_id: process.env.LIFX_CLIENT_ID,
            scope: 'remote_control:all',
            state: state,
            response_type: 'code'
        });

        reqCache.set('query', query);
        return done();

    },

    authorize: function(params, sess, reqCache, done) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        let data = {
            client_id: process.env.LIFX_CLIENT_ID,
            client_secret: process.env.LIFX_CLIENT_SECRET,
            code: params.code,
            grant_type: 'authorization_code'
        };

        let options = {
            json: data,
            headers: {'User-Agent': 'node.js'}
        };


        /**
         * Request the access token
         */
        request.post(lifx_api + '/token', options, function (err, res, bod) {

            /**
             * Reject the token if client has incorrect state parameter (see line
             * 25)
             */
            if (sess.request_state != params.state) {
                return ;
            }

            let token = bod.access_token;

            new Entity.User({id: client.id}).save(
                { token: token, },
                { patch: true }
            ).then(function() {
                return done();
            }).catch(function (reason) {
                return done();
            });
        });
    },

    createOrb: function(params, sess, reqCache, done) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return done();
        }

        /**
         * Validation
         */

        let title = params.title.trim(),
            meter1 = params.meter1,
            meter2 = params.meter2;

        /**
         * Need to track errors
         * @type {Object}
         */
        let errors = {};

        /**
         * Set a resolve function to store the errors in the request cache
         * before calling the done callback, only if there are errors.
         */
        let resolve = function() {
            if(Object.keys(errors).length !== 0) {
                reqCache.set('errors', errors);
                reqCache.set('form', {
                    title: title,
                    meter1: meter1,
                    meter2: meter2
                });

                Meter.initializeMeterList(reqCache, sess, done);
            } else {
                done();
            }
        };

        if (title.length > 150) {
            errors.title = ['Title too long. 150 characters maximum.'];
        }

        if (!validator.isNumeric(meter1)) {
            errors.meter1 = ['Meter not found in our database.'];
        }

        if (!validator.isNumeric(meter2)) {
            errors.meter2 = ['Meter not found in our database.'];
        }

        if(errors.meter1 || errors.meter2) {
            return resolve();
        }

        new Entity.Meter({id: meter1}).fetch().then(function (match) {
            if (!match) {
                errors.meter1 = ['Meter not found in our database.'];
            }

            new Entity.Meter({id: meter2}).fetch().then(function (match2) {
                if (!match2) {
                    errors.meter2 = ['Meter not found in our database.'];
                }

                if(Object.keys(errors).length !== 0) {
                    return resolve();
                }


                /**
                 * Save to database if validation has passed
                 */
                new Entity.Orb({
                    title: title,
                    owner: client.id,
                    meter1: meter1,
                    meter2: meter2
                }).save().then(function() {
                    return resolve();
                })
            });
        });
    },

    saveBulb: function(params, sess, reqCache, done) {
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

module.exports = Account;
