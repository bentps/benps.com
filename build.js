// plugins
var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    handlebars = require('handlebars'),
    collections = require('metalsmith-collections'),
    rewrite = require('metalsmith-rewrite'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    debug = require('metalsmith-debug'),
    drafts = require('metalsmith-drafts');

handlebars.registerHelper('moment', require('helper-moment'));

// limit an array to a maximum of elements (from the start)
// Thanks to http://stackoverflow.com/questions/10377700/limit-results-of-each-in-handlebars-js 
// via https://github.com/parimalsatyal/neustadt.fr-metalsmith/blob/master/build.js
handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Ben Plotkin-Swing',
      description: "Well Balanced Physics"
    }
  })
  .source('./src')
  .destination('./docs')
  .use(drafts())
  .use(collections({
      blog: {
        pattern: ['blog/**/*.md', '!blog/**/index.md'],
        sortBy: 'date',
        reverse: true
      },
    }))
  .use(markdown())
  .use(layouts({
      engine: 'handlebars',
      directory: './layouts',
      pattern: ["*/*/*html","*/*html","*html"],
      partials: {
        blogheader: 'partials/blog-header',
        footer: 'partials/footer'
      }
  }))
  .use(rewrite([{
      pattern: ['**/*.html', '!**/index.html'],
      filename: '{path.dir}/{path.name}/index.html'
    }]))
  .use(serve({
    port: 8081,
    verbose: true
    }))
  .use(watch({
      paths: {
        "${source}/**/*": true,
        "layout/**/*": "**/*",
      }
    }))
  .use(debug())
  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site built!');
    }
  });

