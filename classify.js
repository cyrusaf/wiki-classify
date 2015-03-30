var fs    = require('fs');
var bayes = require('bayes');

var classifier_data = JSON.parse(fs.readFileSync('classifier.json', 'utf8'));
var classifier = bayes.fromJson(classifier_data);

var text = process.argv.slice(2,process.argv.length).join(" ");

console.log(classifier.categorize(text));
