let Service = require('../../model/services'),
    fs = require('fs');

var docs = {
    items: [
        { file: 'intro.adoc', slug: 'intro', label: 'Introduction' },
        { file: 'beginners.adoc', slug: 'beginners', label: 'Beginner\'s Guide: Setting up an Environmental Orb'},
        { file: 'index.adoc', slug: 'full', label: 'Documentation'}
    ],
    page: null,

    getItems: function() {
        return this.items;
    },

    setPage: function(page) {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].slug === page) {
                this.items[i].current = true;
                this.page = this.items[i];

                break;
            }

            if(i === this.items.length-1) {
                return Promise.reject("Page doesn't exist");
            }
        }

        return Promise.resolve();
    },

    getPage: function() {
        return this.page;
    },

    fetchPageContent: function() {
        let me = this;

        return new Promise(function (resolve, reject) {
            try {
                fs.readFile(__dirname + '/../presentations/docs/' + me.page.file, function(err, buffer){
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
