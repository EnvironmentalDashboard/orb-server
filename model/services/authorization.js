/**
 * @overview Responsible for user authentication
 */

let querystring = require('querystring'),
    request = require('request');

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    Meter = require('./meter');

let lifx_api = "https://cloud.lifx.com/oauth";


let Authorization = {

    prepareRedirect: function(sess, reqCache, done) {
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

    authorizeUser: function(params, sess, reqCache, done) {
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
            console.log(sess.request_state);

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
                console.log(reason);
                return done();
            });
        });
    }
};

module.exports = Authorization;
