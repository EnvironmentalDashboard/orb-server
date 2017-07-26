let Service = require('../../model/services'),
    fs = require('fs');

var docs = {
    items: {
        'intro': { file: 'intro.adoc', label: 'Background, Installation, and Hardware' },
        'beginners': { file: 'beginners.adoc', label: 'Get Started' },
        'full': { file: 'index.adoc', label: 'Documentation' }
    },
    slug: null,

    getItems: function() {
        return this.items;
    },

    setSlug: function(slug) {
        if(slug in this.items) {
            this.slug = slug;
            return Promise.resolve();
        }

        this.slug = "intro";
        return Promise.resolve();
    },

    getSlug: function() {
        return this.slug;
    },

    fetchPageContent: function() {
        let me = this;

        return new Promise(function (resolve, reject) {
            try {
                fs.readFile(__dirname + '/../presentations/docs/' + me.items[me.slug].file, function(err, buffer){
                    if (err) return reject(err);

                    return resolve(buffer);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }
};

module.exports = docs;
