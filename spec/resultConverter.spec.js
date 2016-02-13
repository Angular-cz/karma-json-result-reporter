var converter = require('./../resultConverter.js');

describe("Result", function() {

  describe("simplifier", function() {

    it("should mark skipped test", function() {
      var result = {
        skipped: true
      };

      var output = converter.simplifyResult(result);
      expect(output.status).toBeDefined();
      expect(output.status).toBe('SKIPPED');
    });

    it("should mark failed test", function() {
      var result = {
        skipped: false,
        success: false
      };

      var output = converter.simplifyResult(result);
      expect(output.status).toBeDefined();
      expect(output.status).toBe('FAILED');
    });

    it("should mark passed test", function() {
      var result = {
        skipped: false,
        success: true
      };

      var output = converter.simplifyResult(result);
      expect(output.status).toBeDefined();
      expect(output.status).toBe('PASSED');
    });

    it("should preserve log", function() {
      var result = {
        skipped: true,
        log: ['log', 'items']
      };

      var output = converter.simplifyResult(result);
      expect(output.log).toBeDefined();
      expect(output.log).toEqual(['log', 'items']);
    });

    it("should preserve time", function() {
      var result = {
        skipped: true,
        time: 123
      };

      var output = converter.simplifyResult(result);
      expect(output.time).toBeDefined();
      expect(output.time).toEqual(123);
    });

    it("should set time as undefined, if is not defined", function() {
      var result = {
        skipped: true
      };

      var output = converter.simplifyResult(result);
      expect(output.time).not.toBeDefined();
    });

  });
  describe("reduceToObject", function() {

    it("should create suite - description hierarchy", function() {
      var result = {
        skipped: true,
        description: "a description",
        suite: ["a suite"]
      };

      var output = converter.reduceToObject({}, result);
      expect(output["a suite"]).toBeDefined();
      expect(output["a suite"]["a description"]).toBeDefined();
      expect(output["a suite"]["a description"].status).toBe('SKIPPED');
    });

    it("should acccept deep suites hierarchy", function() {
      var result = {
        skipped: true,
        description: "a description",
        suite: ["first suite", "second suite"]
      };

      var output = converter.reduceToObject({}, result);
      expect(output["first suite"]).toBeDefined();
      expect(output["first suite"]["second suite"]).toBeDefined();
      expect(output["first suite"]["second suite"]["a description"]).toBeDefined();
      expect(output["first suite"]["second suite"]["a description"].status).toBe('SKIPPED');
    });

  });

});