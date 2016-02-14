var funMap = require('fun-map');

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

function getPathArray(result) {
  var path = result.suite.slice();
  path.push(result.description);

  return path;
}

function reduceToObject(accumulator, result) {
  var simplifiedResult = simplifyResult(result);
  var path = getPathArray(result);
  return funMap.assocInM(accumulator, path, simplifiedResult);
}

function convertResults(results) {
  return results.reduce(reduceToObject, {});
}

module.exports = {
  simplifyResult: simplifyResult,
  reduceToObject: reduceToObject,
  convertResults: convertResults
};