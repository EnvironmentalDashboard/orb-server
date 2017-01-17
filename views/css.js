/**
 * Css view
 */

 let base = require('./base');

 let css = Object.assign(base, {
    orbAnimations: function (res, cache) {
        if(this.caughtAuthError(cache)) {
            return res.send('Denied.');
        }

        let instructionList = cache.get('orb-instruction-list');

        console.log(instructionList);

        res.setHeader('Content-Type', 'text/css');
        res.render('css/orb.animation.css.hbs', {
            instructions: instructionList,
            layout: false
        });
    }

});

module.exports = css;
