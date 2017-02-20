let Service = require('../../model/services');

var dashboard = {
    iterator: 0,

    retrieveBulbList: function() {
        return Service.BulbList.retrieve(this.session).catch(this.setErrors.bind(this));
    },

    retrieveOrbList: function() {
        return Service.OrbList.retrieve(this.session).catch(this.setErrors.bind(this));
    }
};

module.exports = dashboard;
