/**
 * @overview Responsible for relative value services
 */

let validator = require('validator'),
    exec = require('child_process').exec;

let Entity = require('../entities'),
    Recognition = require('./Recognition'),
    LifxBulbAPI = require('./LifxBulbAPI');

let RelativeValue = {

    update: function(relativeValuesArr) {
        let ids = relativeValuesArr.map(function(relativeValue) {
            return relativeValue.get('id');
        });


        return new Promise(function(resolve, reject) {
            exec(
                "php ../model/services/exe/relative-value-update.php '" + JSON.stringify(ids) + "'",
                function(err, stdout, stderr) {
                    if (err) {
                        reject(err);
                    }

                    resolve(stdout);
                }
            );
        });
    }

};

module.exports = RelativeValue;
