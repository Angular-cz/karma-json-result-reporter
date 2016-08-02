var fs = require('fs');
var writeFile = require('writefile');
var converter = require('./resultConverter');

var log = console.log.bind(console, "JsonResultReporter:");

function writeOutput(config, output) {
  if (config.outputFile) {
    writeFile(config.outputFile, JSON.stringify(output, null, 4), function(err) {
      if (err) {
        log(err);
      } else {
        log("JSON file was written to " + config.outputFile);
      }
    });
  } else {
    process.stdout.write(JSON.stringify(output));
  }
}

var JsonResultReporter = function(baseReporterDecorator, formatError, config) {
  baseReporterDecorator(this);

  var logMessageFormater = function(error) {
    return formatError(error)
  };

  this.clear = function() {
    this.results = [];
    this.errors = [];
  };

  this.onBrowserError = function(browser, error) {
    this.errors.push(error);
  };

  this.onSpecComplete = function(browser, result) {
    result.log = result.log.map(logMessageFormater);
    this.results.push(result);
  };

  this.onRunComplete = function() {
    var output;
    if (this.errors.length) {
      output = converter.convertErrors(this.errors.map(logMessageFormater));
    } else {
      output = converter.convertResults(this.results);
    }
    writeOutput(config, output);

    this.clear();
  };

  this.clear();
};

JsonResultReporter.$inject = ['baseReporterDecorator', 'formatError', 'config.jsonResultReporter'];

module.exports = {
  'reporter:json-result': ['type', JsonResultReporter]
};
