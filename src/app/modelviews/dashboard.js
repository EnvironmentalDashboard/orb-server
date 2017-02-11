let Service = require('../../model/services');

var dashboard = {
    iterator: 0,

    retrieveBulbList: function() {
        return Service.DashboardInformation.getBulbList(this.session).catch(this.setErrors.bind(this));
    },

    retrieveOrbList: function() {
        return Service.DashboardInformation.getOrbList(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = dashboard;
