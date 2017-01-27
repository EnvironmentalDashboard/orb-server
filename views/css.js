/**
 * Css view
 */

 let base = require('./base');

 let css = {
    orbAnimations: function (req, res, next) {
        if(base.caughtAuthError(req.cache)) {
            return res.send('Denied.');
        }

        let instructionList = req.cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'text/css');
        res.render('css/orb.animation.css.hbs', {
            instructions: instructionList,
            layout: false
        });
    }

};

module.exports = css;
