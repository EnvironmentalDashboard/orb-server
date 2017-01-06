/**
 * @overview Authentication controller
 *
 * Uses LifX's authentication
 */

let querystring = require('querystring'),
    request = require('request');

let authentication = {
    /**
     * Redirects client to LifX for authentication
     */
    authenticate: function (req, res) {

        let query = querystring.stringify({
            client_id: process.env.LIFX_CLIENT_ID,
            scope: "remote_control:all",
            state: process.env.LIFX_STATE,
            response_type: "code"
        });

        res.redirect("https://cloud.lifx.com/oauth/authorize?" + query);
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
        request.post('https://cloud.lifx.com/oauth/token', options, function (err, res, bod) {
            console.log(bod);
        });
    }
};

module.exports = authentication;
