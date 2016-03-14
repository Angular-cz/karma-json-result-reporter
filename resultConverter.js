var funMap = require('fun-map');

function splitByNewLine(text) {
  return text.split('\n');
}

function splitItemsByNewLine(texts) {
  return texts.reduce(function(acc, item) {
    return acc.concat(splitByNewLine(item));
  }, []);
}

function simplifyResult(result) {
  var testResult = {
    log: splitItemsByNewLine(result.log || []),
    time: result.time
  };

  if (result.skipped) {
    testResult.status = 'SKIPPED';
  } else {
    testResult.status = result.success ? 'PASSED' : 'FAILED';
  }

  testResult.noExpectations = result.success && result.executedExpectationsCount === 0;

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

function convertErrors(errors) {
  console.log('convertErrors');
  return {"__BROWSER_ERRORS__": splitItemsByNewLine(errors)};
}

module.exports = {
  simplifyResult: simplifyResult,
  reduceToObject: reduceToObject,
  convertResults: convertResults,
  convertErrors: convertErrors
};
