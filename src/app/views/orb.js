let orbView = {
    configure: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            meterListPromise = appmodel.retrieveMeterList(),
            orbPromise = appmodel.retrieveTargetOrb();

        return Promise.all([meterListPromise, orbPromise]).then(function(results) {
            let errors = appmodel.getErrors();

            [meters, orbInfo] = results;

            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            if (errors.noRecord) {
                return res.render('no-record');
            }

            if (!errors && Object.keys(form).length > 1) {
                return res.redirect('/dash/orb/success');
            }

            /**
             * Check if all sample sizes are the same or not
             */
            let customSamples = false;

            if (orbInfo && orbInfo.daySets && Array.isArray(orbInfo.daySets)) {
                let nPointsArr = [];
                orbInfo.daySets.forEach(function(daySet) {
                    nPointsArr.push(daySet.npoints)
                });

                let testEquality = function(val, i, arr) {
                    return val !== arr[0];
                };

                customSamples = nPointsArr.some(testEquality);
            }

            /**
             * Combine form data into 1 form variable
             */
            form = Object.assign({}, orbInfo, form);

            /**
             * Include meter if it's assigned to an orb, but it's organization
             * isn't connected with the user's account
             *
             * This is done with rampant code duplication & a lot of bad code.
             * @TODO refactor
             */
            let notFound = [true, true];

            meters.orgs.forEach(function(orgInfo){
                if(orgInfo.id === form.meter1Org) {
                    notFound[0] = false;
                }

                if(orgInfo.id === form.meter2Org) {
                    notFound[1] = false;
                }
            });

            var orgKey, buildingKey;

            if(notFound[0]) {
                orgKey = meters.orgs.push({
                    id: form.meter1Org,
                    name: form.meter1OrgName
                }) - 1;
                meters.buildings[orgKey] = [];
                meters.meters[orgKey] = [];

                buildingKey = meters.buildings[orgKey].push({
                    id: form.meter1Building,
                    name: form.meter1BuildingName
                }) - 1;
                meters.meters[orgKey][buildingKey] = [];

                meters.meters[orgKey][buildingKey].push({
                    id: form.meter1,
                    meterName: form.meter1Name
                });
            }

            if(notFound[1]) { //duplication is awful
                if(form.meter1Org !== form.meter2Org) {
                    orgKey = meters.orgs.push({
                        id: form.meter2Org,
                        name: form.meter2OrgName
                    }) - 1;
                    meters.buildings[orgKey] = [];
                    meters.meters[orgKey] = [];
                }

                if(form.meter1Building !== form.meter2Building) {
                    buildingKey = meters.buildings[orgKey].push({
                        id: form.meter2Building,
                        name: form.meter2BuildingName
                    }) - 1;
                    meters.meters[orgKey][buildingKey] = [];
                }

                if(form.meter1 !== form.meter2) {
                    meters.meters[orgKey][buildingKey].push({
                        id: form.meter2,
                        meterName: form.meter2Name
                    });
                }
            }

            return res.render('orb-config', {
                loggedIn: loggedIn,
                errors: errors,
                form: form,
                customSamples: customSamples,
                meters: meters,
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                page: {
                    active: {dashboard: true},
                    title: "Orb Configuration"
                },
                helpers: {
                    checked: function(array, haystackIndex, needle) {
                        let dataGrouping = [
                            [1, 2, 3, 4, 5, 6, 7]
                        ];

                        if (orbInfo && orbInfo.daySets) {
                            dataGrouping = orbInfo.daySets.map(function(set) {
                                return set.days;
                            });
                        }

                        if (dataGrouping[haystackIndex] && dataGrouping[haystackIndex].indexOf(needle + 1) > -1) {
                            return ' checked';
                        }
                    },

                    add: function(a, b) {
                        return a + b;
                    },

                    npoints: function(arr, key) {
                        if(!arr) {
                            return ;
                        }

                        return arr[key] && arr[key].npoints ? arr[key].npoints : null;
                    },

                    building: function(orgKey, buildingKey) {
                        return meters.buildings[orgKey][buildingKey].name;
                    },

                    org: function(orgKey) {
                        return meters.orgs[orgKey].name;
                    }
                },
                active: {dashboard: true}
            });
        });
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('orb-config-success', {
            loggedIn: loggedIn,
            page: {
                active: { dashboard: true },
                title: "Configuration Success"
            }
        });
    },

    deletePrompt: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            orbPromise = appmodel.retrieveTargetOrb();

        return orbPromise.then(function(orbInfo) {
            let errors = appmodel.getErrors();

            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            if (errors.noRecord) {
                return res.render('no-record');
            }

            res.render('orb-delete-confirm', {
                loggedIn: loggedIn,
                orb: orbInfo,
                page: {
                    active: {dashboard: true},
                    title: "Delete Configmration"
                }
            });
        });
    },

    delete: function(res, appmodel) {
        res.redirect('/dash');
    }
};

module.exports = orbView;
