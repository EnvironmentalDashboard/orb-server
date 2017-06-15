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

        let page = appmodel.getPage(),
            contentPromise = appmodel.fetchPageContent();

        return contentPromise.then(function(content){
            return res.render('docs', {
                loggedIn: loggedIn,
                content: asciidoctor.convert(content.toString()),
                pages: appmodel.getItems()
            });
        });

    }
};

module.exports = docsView;
