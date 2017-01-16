/**
 * @overview Responsible for account services
 */

let querystring = require('querystring'),
    request = require('request'),
    validator = require('validator'),
    sodium = require('sodium').api,
    Bookshelf = require('../../lib/dbconnect.js'),
    util = require('util');

let Entity = require('../entities'),
    Recognition = require('./recognition');

const lifx_api = "https://cloud.lifx.com/oauth";

let Account = {

    register: function (params, reqCache) {

        let email = params.email.trim(),
            fname = params.fname.trim(),
            lname = params.lname.trim(),
            password1 = params.password1,
            password2 = params.password2;

        let errors = {};

        /**
         * Make sure the passwords are equal
         */
        if (password1 !== password2) {
            errors.confirm = ['Passwords must match.'];
        }

        /**
         * This function is called to stop the promise chain that will occur below
         * when errors should stop the service from completing registration
         *
         * Saves the errors and related form information to cache
         */
        let resolve = function () {
            reqCache.set('errors', errors);
            reqCache.set('form', {
                email: email,
                fname: fname,
                lname: lname
            });

            return Promise.resolve(errors);
        };

        /**
         * Create a user domain object from the inputted values and validate
         * this information
         */
         let user = new Entity.User({
             email: email,
             fname: fname,
             lname: lname,
             password: password1
         });

        return user.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            /**
             * If the user's email didn't validate
             */
            if (errors.email) {
                return resolve();
            }

            /**
             * We need to make sure the user's email deosn't exist already
             */
            return new Entity.User({email: email}).fetch();
        }).then(function (match){
            if (match) {
                errors.email = ['Email already taken.'];
            }

            if (Object.keys(errors).length !== 0) {
                return resolve();
            }

            let pwdBuffer = Buffer.from(password1);

            let hash = Buffer.from(sodium.crypto_pwhash_argon2i_str(
                pwdBuffer,
                sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
                sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
            ));

            return user.save({
                password: hash
            });
        }).catch(console.log.bind(console));
    },

    createOrb: function(params, sess, reqCache) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        let title = params.title.trim(),
            meter1 = params.meter1,
            meter2 = params.meter2,
            inputtedDaySets = params.daySets;

        let daySets = [];

        /**
         * Need to track errors
         * @type {Object}
         */
        let errors = {};

        inputtedDaySets.forEach(function (val, key) {
            if (!daySets[val]) {
                daySets[val] = [];
            }

            daySets[val].push(key);
        });

        console.log(daySets);

        let resolve = function () {
            reqCache.set('errors', errors);
            reqCache.set('form', {
                title: title,
                meter1: meter1,
                meter2: meter2 //@TODO update this with sample and day sets
            });

            return DashboardInformation.initializeMeterList(reqCache, sess);
        };

        let orb = new Entity.Orb({
            title: title,
            meter1: meter1,
            meter2: meter2,
            owner: client.id
        });

        return orb.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            return new Entity.Meter({id: meter1}).fetch();
        }).then(function (match) {
            if (!match) {
                errors.meter1 = ['Meter not found in our database.'];
            }

            return new Entity.Meter({id: meter2}).fetch();
        }).then(function (match) {
            if (!match) {
                errors.meter2 = ['Meter not found in our database.'];
            }

            if (Object.keys(errors).length !== 0) {
                return resolve();
            }

            return orb.save();
        }).catch(console.log.bind(console));
    },

    saveBulb: function(params, sess, reqCache) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
        }

        let errors = {};

        let selector = params.selector,
            enabled = params.enabled,
            orb = params.orb === "" ? null : params.orb;

        let bulbParams = {
                owner: client.id,
                selector: selector,
                enabled: enabled === "true",
                orb: orb
            },
            bulb = new Entity.Bulb(bulbParams);

        return bulb.validate().then(function (validationErrs) {
            if (validationErrs) {
                Object.assign(errors, validationErrs);
            }

            if(orb == null || orb == "") {
                return Promise.resolve();
            }

            return new Entity.Orb({id: orb}).fetch();
        }).then(function (match) {
            if((match && match.get('owner') === client.id)
                || orb == null) {

                /**
                 * NOTICE: here we leak data mapper logic into the service layer
                 * because Knex.js and Bookshelf.js do not support upserts
                 */
                let query = util.format(`\
                    INSERT INTO \`%s\` (owner, enabled, orb, selector)
                        VALUES (:owner, :enabled, :orb, :selector)
                    ON DUPLICATE KEY UPDATE
                        enabled = :enabled,
                        orb = :orb,
                        owner = :owner
                `, bulb.tableName);

                return Bookshelf.knex.raw(query, bulbParams);

            }

            return Promise.resolve();
        })

    },

    authorizationRedirect: function(sess, reqCache) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
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
        return Promise.resolve();

    },

    authorize: function(params, sess, reqCache) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            reqCache.set('auth-error', true);
            return Promise.resolve();
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
        return request.post(lifx_api + '/token', options, function (err, res, bod) {

            /**
             * Reject the token if client has incorrect state parameter
             */
            if (sess.request_state != params.state) {
                return ;
            }

            let token = bod.access_token;

            return new Entity.User({id: client.id}).save(
                { token: token, },
                { patch: true }
            );
        }).then(function() {
            return Promise.resolve();
        }).catch(console.log.bind(console));
    }

};

module.exports = Account;
