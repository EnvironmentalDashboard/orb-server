function DependentSelect(mostDependentSelect) {
    var dependents = {},
        masterDependency;

    var prepare = function(element) {
        if(!element.hasAttribute('data-depends-on')) {
            masterDependency = element;
            return ;
        }

        indexOptgroups(element);
        depopulate(element);

        var dependency = document.getElementById(element.dataset.dependsOn);

        if (!dependency) {
            return ;
        }

        dependency.dataset.dependent = element.id;

        $(dependency).on('change', function(){
            triggerSelectChanges(this);
        });

        return prepare(dependency);
    };

    /**
     * Adds all child <optgroup> of element to dependents object
     * @param  {HTMLCollection} element Parent of <optgroup> elements to index
     */
    var indexOptgroups = function(element) {
        var optgroups = element.getElementsByTagName('optgroup'),
            indexedOptgroups = {},
            optgroup;

        for (var i = 0; i < optgroups.length; i++) {
            optgroup = optgroups[i];

            indexedOptgroups[optgroup.id] = optgroup;
        }

        dependents[element.id] = indexedOptgroups;
    };

    /**
     * Depopulates a given object
     * @param {HTMLElement} element to depopuate
     */
    var depopulate = function(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    var triggerSelectChanges = function(dependency) {
        if (!dependency.hasAttribute('data-dependent')) {
            return ;
        }

        var dependent = document.getElementById(dependency.dataset.dependent);

        if (dependent) {
            depopulate(dependent);

            var dependencyValue = dependency.options[dependency.selectedIndex].dataset.dependentValue;

            // Append correct option group
            dependent.appendChild(dependents[dependent.id][dependencyValue]);

            $(dependent).trigger('change');
        }
    };

    prepare(mostDependentSelect);
    triggerSelectChanges(masterDependency);
};
