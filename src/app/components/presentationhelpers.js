/**
 * @overview Handlebar helpers
 */

let helpers = {
    selected: function(selectedValue, comparedValue) {
        if (selectedValue == comparedValue) {
            return ' selected';
        }
    },
};

module.exports = helpers;
