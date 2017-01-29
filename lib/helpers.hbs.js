/**
 * @overview Handlebar helpers
 */

let defaultDataGrouping = [[1,2,3,4,5,6,7]];

let helpers = {
    selected: function (selectedValue, comparedValue) {
        if(selectedValue == comparedValue) {
            return ' selected';
        }
    },
};

module.exports = helpers;
