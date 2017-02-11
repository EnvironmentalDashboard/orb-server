let Service = require('../../model/services');

var dashboard = {
    iterator: 0,

    retrieveBulbList: function() {
        return Service.Bulb.retrieveList(this.session).catch(this.setErrors.bind(this));
    },

    retrieveOrbList: function() {
        return Service.Orb.retrieveList(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = dashboard;
