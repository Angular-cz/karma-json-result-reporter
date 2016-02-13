var R = require('ramda');

function simplifyResult(result) {
  var testResult = {
    log: result.log || [],
    time: result.time
  };

  if (result.skipped) {
    testResult.status = 'SKIPPED';
  } else {
    testResult.status = result.success ? 'PASSED' : 'FAILED';
  }

  return testResult;
}

function reduceToObject(accumulator, result) {
  var simplifiedResult = simplifyResult(result);
  var path = R.append(result.description, result.suite);
  return R.assocPath(path, simplifiedResult, accumulator);
}

function convertResults(results) {
  return results.reduce(reduceToObject, {});
}

module.exports = {
  simplifyResult: simplifyResult,
  reduceToObject: reduceToObject,
  convertResults: convertResults
};