/**
 * Css view
 */

let css = {
    orbAnimations: function (req, res, next) {
        let instructionList = req.cache.get('orb-instruction-list');

        res.setHeader('Content-Type', 'text/css');
        res.render('css/orb.animation.css.hbs', {
            instructions: instructionList,
            layout: false
        });
    }

};

module.exports = css;
