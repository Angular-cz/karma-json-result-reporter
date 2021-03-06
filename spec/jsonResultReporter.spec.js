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

      this.helper = jasmine.createSpyObj('helper', ['mkdirIfNotExists']);
      this.helper.mkdirIfNotExists.and.callFake(function(dirStr, callback) {
        if (!fs.existsSync(dirStr)) {
          mkdirp.sync(dirStr);
        }
        callback();
      });

      var log = jasmine.createSpyObj('log', ['debug', 'warn']);
      this.logger = jasmine.createSpyObj('logger', ['create']);
      this.logger.create.and.returnValue(log);
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

      var RESULT = {
        suite: ['test suite'],
        description: 'test description',
        log: []
      };

      beforeEach(function(done) {
        this.resultData = {
          result: null,
          error: null
        };

        this.tempTestDir = os.tmpdir() + '/karma-json-result-reporter';

        if (fs.existsSync(this.tempTestDir)) {
          del(this.tempTestDir)
              .then(fs.mkdir(this.tempTestDir, done));
        } else {
          fs.mkdir(this.tempTestDir, done)
        }

        this.reportResultDataAndCheckOutputFile = function(done, resultData, config) {
          var defaultConfig = {
            outputFile: this.tempTestDir + '/report-file.json'
          };

          config = config || defaultConfig;

          var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config, this.helper, this.logger);
          if (resultData.error) {
            reporter.onBrowserError('test', resultData.error);
          }
          if (resultData.result) {
            reporter.onSpecComplete('test', resultData.result);
          }
          reporter.onRunComplete();

          waitForFileAndCheckContent(config.outputFile, done);
        }


      });

      afterEach(function(done) {
        if (fs.existsSync(this.tempTestDir)) {
          del(this.tempTestDir, {force: true})
              .then(done, done.fail);
        }
      });

      it('should write error to config output file', function(done) {
        this.resultData.error = ERROR_TEXT;

        this.reportResultDataAndCheckOutputFile(done, this.resultData);

      });

      it('should write results to config output file', function(done) {
        this.resultData.result = RESULT;

        this.reportResultDataAndCheckOutputFile(done, this.resultData);
      });

      it('should write both errors and results if both exist', function(done) {
        this.resultData.error = ERROR_TEXT;
        this.resultData.result = RESULT;

        this.reportResultDataAndCheckOutputFile(done, this.resultData);

      });

      it('should be able write report to nested path', function(done) {
        var config = {
          outputFile: this.tempTestDir + '/my/nested/path/report-file.json'
        };

        this.resultData.error = ERROR_TEXT;

        this.reportResultDataAndCheckOutputFile(done, this.resultData, config);
      });

      it('should write results synchronously, if isSynchronous is set', function(done) {
        var config = {
          outputFile: this.tempTestDir + '/my/nested/path/report-file.json',
          isSynchronous: true
        };

        var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config, this.helper, this.logger);
        reporter.onBrowserError('test', ERROR_TEXT);
        reporter.onRunComplete();

        if (!checkFileAndContentSynchronously(config.outputFile, done)) {
          done.fail('Results does not exists - ' + config.outputFile);
        }
      });

      function waitForFileAndCheckContent(outputFile, done) {
        setImmediate(function() {
          if (!checkFileAndContentSynchronously(outputFile, done)) {
            waitForFileAndCheckContent(outputFile, done);
          }
        });
      }

      function checkFileAndContentSynchronously(outputFile, done) {
        if (fs.existsSync(outputFile)) {
          fs.readFile(outputFile, function(err, result) {
            if (err) {
              done.fail('Read file error - ' + outputFile + ': ' + err);
              return;
            }

            if (this.result) {
              expect(result.toString()).toMatch(this.resultdata.result.description);
            }

            if (this.error) {
              expect(result.toString()).toMatch(this.resultdata.error);
            }
            done();
          });

          return true;
        } else {
          return false;
        }
      }

    });
  })
});
