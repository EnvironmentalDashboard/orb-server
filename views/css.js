/**
 * Css view
 */

 let base = require('./base');

 let css = Object.assign({
    orbAnimations: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.send('Denied.');
        }

        let instructionList = cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'text/css');
        res.render('css/orb.animation.css.hbs', {
            instructions: instructionList,
            layout: false
        });
    }

}, base);

module.exports = css;
