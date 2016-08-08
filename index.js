var path = require('path');
var fs = require('fs');
var converter = require('./resultConverter');

function writeOutput(config, output, helper, logger) {

  var log = logger.create('karma-json-result-reporter');

  if (config.outputFile) {
    helper.mkdirIfNotExists(path.dirname(config.outputFile), function() {
      log.debug('Writing test results to JSON file ' + config.outputFile);
      try {
        fs.writeFileSync(config.outputFile, JSON.stringify(output, null, 4));
      } catch (err) {
        log.warn('Cannot write test results to JSON file\n\t' + err.message);
      }
    });
  } else {
    process.stdout.write(JSON.stringify(output));
  }
}

var JsonResultReporter = function(baseReporterDecorator, formatError, config, helper, logger) {

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
    writeOutput(config, output, helper, logger);

    this.clear();
  };

  this.clear();
};

JsonResultReporter.$inject = ['baseReporterDecorator', 'formatError', 'config.jsonResultReporter', 'helper', 'logger'];

module.exports = {
  'reporter:json-result': ['type', JsonResultReporter]
};
