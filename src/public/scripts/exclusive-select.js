function ExclusiveSelect(exclusiveSelect1, exclusiveSelect2) {
    var dontExclude = false;

    var startExclusion = function() {
        dontExclude = false;

        makeExclusion(exclusiveSelect1, exclusiveSelect2);
        makeExclusion(exclusiveSelect2, exclusiveSelect1);
    };

    var stopExclusion = function() {
        dontExclude = true;

        makeExclusion(exclusiveSelect1, exclusiveSelect2);
        makeExclusion(exclusiveSelect2, exclusiveSelect1);
    };

    var makeExclusion = function(select, corollarySelect) {
        let excludedValue = select.options[select.selectedIndex].value;

        for (var i = 0; i < corollarySelect.options.length; i++) {
            if (excludedValue === corollarySelect.options[i].value && !dontExclude && excludedValue != "----") {
                corollarySelect.options[i].disabled = true;
            } else {
                corollarySelect.options[i].disabled = false;
            }
        }
    };

    $(exclusiveSelect1).on('change', function() {
        makeExclusion(this, exclusiveSelect2);
    });

    $(exclusiveSelect2).on('change', function() {
        makeExclusion(this, exclusiveSelect1);
    });

    $(document).ready(function(){
        makeExclusion(exclusiveSelect1, exclusiveSelect2);
        makeExclusion(exclusiveSelect2, exclusiveSelect1);
    });

    return {
        startExclusion: startExclusion,
        stopExclusion: stopExclusion
    }
};
