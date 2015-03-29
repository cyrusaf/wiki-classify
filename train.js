var bayes = require('bayes');
var classifier = bayes();

var util = require('util');

var request = require('sync-request');
var cheerio = require('cheerio');
var fs      = require('fs');

var training_data = JSON.parse(fs.readFileSync('links.json', 'utf8'));

var counter = 0;
var total_links = training_data.map(function(obj) {
	return obj.links
}).reduce(function(prev, curr, index, array) {
	if (index == 1) {
		return prev.length + curr.length;
	}
	return prev + curr.length;
});

console.log("\nTotal links: " + total_links + "\n");

process.stdout.write("=== Training ===\n");
for (var category of training_data) {
	for (var link of category.links) {
		var res = request('GET', link);
		if (res.statusCode != 200) {
			continue;
		}
		var $ = cheerio.load(res.getBody());
		process.stdout.write(counter.toString() + " ");
		classifier.learn($("#mw-content-text").text(), category.name);
		counter++;

		if (counter > 1000) {
				break;
		}
	}
	if (counter > 1000) {
			break;
	}
}

fs.writeFile('classifier.json', JSON.stringify(classifier.toJson()), function(err) {
	if (err) {
	  console.log("Error saving file...");
	  return
	}
	console.log('Done!!')
});
