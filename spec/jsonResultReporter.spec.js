const os = require('os');
const fs = require('fs');
const mkdirp = require('mkdirp');
const del = require('del');

var reporterExport = require('./../index.js');
var JsonResultReporter = reporterExport['reporter:json-result'][1];

describe("JsonResultReporter", function() {

  it("should should be function", function() {
    expect(JsonResultReporter).toEqual(jasmine.any(Function));
  });


  it("should should be function", function() {
    expect(JsonResultReporter).toEqual(jasmine.any(Function));
  });

  describe("as karma baseReporterDecorator", function() {

    beforeEach(function() {
      this.baseReporterDecorator = jasmine.createSpy('baseReporterDecorator');
      this.formatError = jasmine.createSpy('formatError').and.callFake(function(error) {
        return error;
      });

      this.helper = jasmine.createSpy('helper');
      this.helper.mkdirIfNotExists = jasmine.createSpy('helper.mkdirIfNotExists spy').and.callFake(function(dirStr, callback) {
        if (!fs.existsSync(dirStr)) {
          mkdirp.sync(dirStr);
        }
        callback();
      });

      this.logger = jasmine.createSpy('logger');
      log = jasmine.createSpy('log');
      log.debug = jasmine.createSpy('log.debug spy').and.callFake(function(output) {});
      log.warn = jasmine.createSpy('log.warn spy').and.callFake(function(output) {});
      this.logger.create = jasmine.createSpy('logger.create spy').and.callFake(function(loggerName) {
        return log;
      });
    });


    it('should be instantiable', function() {
      var config = {};

      var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config, this.helper, this.logger);

      expect(reporter).toEqual(jasmine.any(Object));
      expect(this.baseReporterDecorator).toHaveBeenCalledTimes(1);
      expect(this.formatError).not.toHaveBeenCalled();

    });

    describe("with real files", function() {

      var ERROR_TEXT = 'some test error';

      beforeEach(function(done) {
        this.tempTestDir = os.tmpdir() + '/karma-json-result-reporter';

        if (fs.existsSync(this.tempTestDir)) {
          del(this.tempTestDir)
              .then(fs.mkdir(this.tempTestDir, done));
        } else {
          fs.mkdir(this.tempTestDir, done)
        }

      });

      afterEach(function(done) {
        if (fs.existsSync(this.tempTestDir)) {
          del(this.tempTestDir, {force: true})
              .then(done, done.fail);
        }
      });

      it('should write error to config output file', function(done) {
        var config = {
          outputFile: this.tempTestDir + '/report-file.json'
        };


        var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config, this.helper, this.logger);
        reporter.onBrowserError('test', ERROR_TEXT);
        reporter.onRunComplete();

        waitForFileAndCheckContent(config.outputFile, done);
      });

      it('should be able write report to nested path', function(done) {
        var config = {
          outputFile: this.tempTestDir + '/my/nested/path/report-file.json'
        };

        var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config, this.helper, this.logger);
        reporter.onBrowserError('test', ERROR_TEXT);
        reporter.onRunComplete();

        waitForFileAndCheckContent(config.outputFile, done);
      });


      function waitForFileAndCheckContent(outputFile, done) {
        setImmediate(function() {
          if (fs.existsSync(outputFile)) {
            fs.readFile(outputFile, function(err, result) {
              if (err) {
                done.fail('Read file error - ' + outputFile + ': ' + err);
                return;
              }

              expect(result.toString()).toMatch(ERROR_TEXT);
              done();
            });
          } else {
            waitForFileAndCheckContent(outputFile, done);
          }
        });
      }
    });
  })
});
