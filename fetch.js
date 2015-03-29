var request = require('sync-request');
var cheerio = require('cheerio');
var fs      = require('fs');

// Get contents of Wikipedia category page
var res = request('GET', 'http://en.wikipedia.org/wiki/Portal:Contents/Categories');

// Setup vars
var subCategories = {};
var categories = [];

// Load body into cheerio
var $ = cheerio.load(res.getBody());

// Compile list of categories
var hlists = $('.hlist');
hlists.each(function(i, item) {
  var temp = $(this).find('li');
  var category;
  var links = [];

  if (temp.length <= 1) {
    return false
  }

  temp.each(function(i, tempItem) {
    if (i == 0) {
      category = $(this).text();

      if (['Overviews'].indexOf(category) != -1) {
        return false
      }

      subCategories[category] = [];
      categories[category] = [];
    } else {
      subCategories[category].push(`http://en.wikipedia.org${$(this).find('a').attr('href')}`);
    }
  });
});

for (var key in subCategories) {
  console.log(" ");
  console.log(key);
  var category = {name: key, links: []};
  for (var subCat of subCategories[key]) {
    res = request('GET', subCat);
    $ = cheerio.load(res.getBody());
    var links = $('.mw-category a');
    links.each(function(i, link) {
      var regex1 = /\/wiki\/Category/;
      var regex2 = /\/wiki\/Portal/;

      if (regex1.test($(this).attr('href')) || regex2.test($(this).attr('href'))) {
        console.log("HAH");
        return
      }

      var tempLink = `http://en.wikipedia.org${$(this).attr('href')}`;
      console.log(tempLink);
      category.links.push(tempLink);
    });
    categories.push(category);
  }
}

fs.writeFile('links.json', JSON.stringify(categories), function(err) {
  if (err) {
    console.log("Error saving file...");
    return
  }
  console.log('Done!!')
});
