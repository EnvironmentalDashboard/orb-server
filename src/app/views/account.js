let accountView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            bulbIntegrationListPromise = appmodel.retrieveIntegrationList(),
            userOrgListPromise = appmodel.retrieveUserOrganizationList(),
            orgListPromise = appmodel.retrieveOrganizationList();

        let promises = [bulbIntegrationListPromise, userOrgListPromise, orgListPromise];

        return Promise.all(promises).then(function(results) {
            if (appmodel.getAuthError()) {
                return res.render('denied');
            }

            [integrationList, userOrgList, orgList] = results;

            /**
             * Org processing
             */
            userOrgList = userOrgList.map(function(userOrg) {
                return userOrg.attributes.org_id;
            });

            orgList = orgList.map(function(element) {
                return {
                    id: element.attributes.id,
                    name: element.attributes.name
                }
            });

            /**
             * Bulb Integration processing
             */
            let integrations = [];

            integrationList.forEach(function(integration){
                integrations.push({
                    id: integration.attributes.id,
                    label: integration.attributes.label || false,
                    type: integration.attributes.type,
                    requiresAuth: integration.attributes.status !== 1,
                });
            });

            return res.render('account', {
                loggedIn: loggedIn,
                integrations: integrations,
                userOrgList: userOrgList,
                orgList: orgList,
                page: {
                    active: {account:true},
                    title: "Account Overview"
                },
                helpers: {
                    checkedIfIn: function(val, haystack) {
                        if (!val || !haystack) {
                            return false;
                        }

                        //If `haystack` is an array, see if `val` exists in it
                        if(Array.isArray(haystack) && haystack.indexOf(val) > -1) {
                            return "checked";

                            //If `haystack` isn't an array, see if `val` equals it
                        } else if(!Array.isArray(haystack) && val === haystack) {
                            return "checked";
                        }

                        return ;
                    }
                }
            });
        });
    },

    save: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            errors = appmodel.getErrors();

        if (appmodel.getAuthError()) {
            return res.render('denied');
        }

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/config/success');
        }

        return res.render('account-config', {
            loggedIn: loggedIn,
            form: form || loggedIn,
            errors: errors,
            page: {
                active: { account:true },
                title: "Account Settings"
            }
        });
    },

    updatePassword: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            errors = appmodel.getErrors(),
            form = appmodel.getInputs();

        if (!loggedIn) {
            return res.render('denied');
        }

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/config/success');
        }

        return res.render('account-password-config', {
            loggedIn: loggedIn,
            errors: errors,
            page: {
                active: { account:true },
                title: "Change Password"
            }
        });
    },

    updateOrganizations: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (!loggedIn) {
            return res.render('denied');
        }

        return res.redirect('/account');
    },

    success: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if (!loggedIn) {
            return res.render('denied');
        }

        return res.render('account-config-success', {
            loggedIn: loggedIn,
            page: {
                active: { account:true },
                title: "Configuration Success"
            }
        });
    },

    register: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser(),
            form = appmodel.getInputs(),
            errors = appmodel.getErrors(),
            organizationListPromise = appmodel.retrieveOrganizationList();

        if (!errors && Object.keys(form).length > 0) {
            return res.redirect('/account/signup/success');
        }

        return organizationListPromise.then(function(organizationList) {
            organizationList = organizationList.map(function(element) {
                return {
                    id: element.attributes.id,
                    name: element.attributes.name
                }
            });

            res.render('register', {
                loggedIn: loggedIn,
                form: form,
                errors: errors,
                orgList: organizationList,
                page: {
                    active: { signup: true },
                    title: "Register"
                },
                helpers: {
                    checkedIfIn: function(val, haystack) {
                        if (!val || !haystack) {
                            return false;
                        }

                        //If `haystack` is an array, see if `val` exists in it
                        if(Array.isArray(haystack) && haystack.indexOf(val.toString()) > -1) {
                            return "checked";

                        //If `haystack` isn't an array, see if `val` equals it
                    } else if(!Array.isArray(haystack) && val.toString() === haystack) {
                            return "checked";
                        }

                        return ;
                    }
                }
            });
        });
    },

    registerSuccess: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        return res.render('register-success', {
            loggedIn: loggedIn,
            page: {
                active: { signup: true },
                title: "Registration Success"
            }
        });
    }
};

module.exports = accountView;
