/**
 * @overview Responsible for orb services
 */

let Entity = require('../entities'),
    Recognition = require('./recognition'),
    LifxBulbAPI = require('./lifxbulbapi');

let Bulb = {
    retrieveList: function(sess) {
        let client = Recognition.knowsClient(sess);

        if (!client) {
            return Promise.reject({
                authError: true
            });
        }

        let bulbList = {}, updatedClient;

        return new Entity.User({id: client.id}).fetch().then(function (user) {
            updatedClient = user;

            /**
             * If the client's token is empty/null then they haven't tried to
             * authorize their account with LifX
             */
            if (user.get('token') == null || user.get('token') === '') {
                return Promise.reject('This account isn\'t authroized with a LIFX account. Please authorize to link your accounts.');
            }

            return LifxBulbAPI.getBulbList(updatedClient.get('token'));
        }).then(function (bulbsFromAPI) {
            if(bulbsFromAPI) {
                JSON.parse(bulbsFromAPI).forEach(function (bulb) {
                    bulbList[bulb.id] = {info: bulb};
                });
            }

            return Entity.Bulb.collection().query('where', 'owner', '=', client.id).fetch({withRelated: ['orb']});
        }).then(function (bulbCollection) {

            if (bulbCollection) {
                bulbCollection.forEach(function (bulb) {
                    if(bulbList[bulb.get('selector')]) {
                        bulbList[bulb.get('selector')].config = bulb;
                    }
                });
            }

            for (var key in bulbList) {
                let bulb = bulbList[key];

                if(bulb.info && (bulb.info.label.substring(0,4) === "LIFX"
                    || bulb.info.group.name === "My Room"
                    || bulb.info.location.name === "My Group")) {
                    /**
                     * @TODO
                     */
                    //bulbList.labellingNotice = true;

                    break;
                }
            }

            return Promise.resolve(bulbList);
        }).catch(function(reason) {
            /**
             * If there was an exception, set a generic authorization notice &
             * resolve
             */
            console.log(reason);
            return Promise.reject('The access token associated with your account went bad. Please reauthorize to link your accounts.');
        });

    }
};

module.exports = Bulb;
