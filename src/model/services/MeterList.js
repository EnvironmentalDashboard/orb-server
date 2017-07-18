/**
 * @overview Responsible for meter listing services
 */

let Entity = require('../entities'),
    Recognition = require('./Recognition');


let MeterList = {
    /**
     * Retrieves the MeterList
     * @param  {Object} sess Session Object
     * @return {Promise} Resolves with list on success, reject on errors.
     */
    retrieve: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        return new Entity.User({ id: client.id }).fetch({
            withRelated: ['userOrgs']
        }).then(function(user) {
            let orgList = [];
            let buildingList = [];
            let meterList = [];

            let userOrgs = user.related('userOrgs');
            let userOrgPromises = [];

            //Loop every userOrg
            userOrgs.forEach(function(userOrg) {
                //Fetch organization related to current UserOrg
                userOrgPromises.push(userOrg.related('org').fetch().then(function(org) {
                    let orgData = {
                        name: org.get('name'),
                        id: org.get('id')
                    };

                    //Add to org list
                    let orgPos = orgList.push(orgData)-1;

                    //Create arrays on both meterList and buildingList at orgPos
                    buildingList[orgPos] = [];
                    meterList[orgPos] = [];

                    //Fetch meters related to organization
                    return org.related('meters').fetch({
                        withRelated: ['building']
                    }).then(function (meters) {
                        meters.forEach(function(meter) {
                            let buildingData = {
                                name: meter.related('building').get('name'),
                                id: meter.related('building').get('id')
                            };

                            let buildingPos = buildingList[orgPos].findIndex(function(element) {
                                return element.id === buildingData.id;
                            });

                            if(buildingPos === -1) {
                                buildingPos = buildingList[orgPos].push(buildingData) - 1;
                                meterList[orgPos][buildingPos] = [];
                            }

                            meterList[orgPos][buildingPos].push({
                                meterName: meter.get('name'),
                                id: meter.get('bos_uuid')
                            });
                        });
                    }).catch(console.log.bind(console));
                }));
            });

            return Promise.all(userOrgPromises).then(function(){
                return Promise.resolve({
                    orgs: orgList,
                    buildings: buildingList,
                    meters: meterList
                });
            });
        });
    }
};

module.exports = MeterList;
