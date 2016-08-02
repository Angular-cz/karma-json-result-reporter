const os = require('os');
const fs = require('fs');
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
    });


    it('should be instantiable', function() {
      var config = {};

      var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config);

      expect(reporter).toEqual(jasmine.any(Object));
      expect(this.baseReporterDecorator).toHaveBeenCalledTimes(1);
      expect(this.formatError).not.toHaveBeenCalled();

    });

    describe("with real files", function() {

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

        var reporter = new JsonResultReporter(this.baseReporterDecorator, this.formatError, config);
        reporter.onBrowserError('test', 'some test error');
        reporter.onRunComplete();

        fs.readFile(config.outputFile, function(err, result) {
          if (err) {
            done.fail('Read file error - ' + config.outputFile + ': ' + err)
          }

          expect(result.toString()).toMatch('some test error');
          done();
        });


      });
    });
  })
});
