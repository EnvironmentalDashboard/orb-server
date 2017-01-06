/**
 * @overview Authentication controller
 *
 * Uses LifX's OAuth 2.0 authorization
 */

let querystring = require('querystring'),
    request = require('request');

let lifx_api = "https://cloud.lifx.com/oauth";

let authorization = {

    /**
     * Redirects client to LifX for authorization
     */
    authenticate: function (req, res) {

        /**
         * Random, unguessable string to prevent CSS attacks: base64 encodes the
         * timestamp multipled by a psuedorandom decimal (0-1) and removes non-
         * alphanumerics
         * @type {String}
         */
        let state = (Buffer.from(''+(Math.random() * +new Date())).toString('base64'))
            .replace(/[^0-9a-z]/gi, '');

        req.session.request_state = state;

        let query = querystring.stringify({
            client_id: process.env.LIFX_CLIENT_ID,
            scope: 'remote_control:all',
            state: state, //@TODO prevent CSS attacks
            response_type: 'code'
        });

        res.redirect(lifx_api + '/authorize?' + query);
    },

    /**
     * Retrieves information from LifX's redirect
     */
    redirect: function (req, res) {

        let params = {
            client_id: process.env.LIFX_CLIENT_ID,
            client_secret: process.env.LIFX_CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code'
        };

        let options = {
            json: params,
            headers: {'User-Agent': 'node.js'}
        };


        /**
         * Request the access token
         */
        request.post(lifx_api + '/token', options, function (err, res, bod) {
            console.log(req.session.request_state);

            /**
             * Reject the token if client has incorrect state parameter (see line
             * 25)
             */
            if (req.session.request_state != req.query.state) {
                return ;
            }

            let token = bod.access_token;

            console.log(token);

            //req.session.access_token

            //if (Services.recognition.knows(token))
        });
    }
};

module.exports = authorization;
