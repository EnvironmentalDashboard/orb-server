var asciidoctor = require('asciidoctor.js')(),
    Handlebars = require('handlebars');

let docsView = {
    index: function(res, appmodel) {
        let loggedIn = appmodel.getAuthenticatedUser();

        if(appmodel.getErrors()) {
            return res.render('docs', {
                loggedIn: loggedIn,
                content: 'Page doesn\'t exist'
            });
        }

        let contentPromise = appmodel.fetchPageContent(),
            pages = JSON.parse(JSON.stringify(appmodel.getItems())),
            slug = appmodel.getSlug();

        pages[slug].active = true;

        return contentPromise.then(function(content){
            return res.render('docs', {
                loggedIn: loggedIn,
                content: asciidoctor.convert(content.toString()),
                pages: pages,
                page: {
                    active: { docs: true },
                    title: pages[slug].label
                }
            });
        });

    }
};

module.exports = docsView;
