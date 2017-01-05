/**
 * @overview Page controller
 */

let Entities = require('../model/entities');

let pages = {
    index: function(req, res) {

        res.render('index');
    },
};

module.exports = pages;
