# Karma JSON result reporter

[![npm version](https://img.shields.io/npm/v/karma-json-result-reporter.svg?style=plastic)](https://www.npmjs.com/package/karma-json-result-reporter)
[![Travis](https://img.shields.io/travis/Angular-cz/karma-json-result-reporter.svg)](https://travis-ci.org/Angular-cz/karma-json-result-reporter)


This is a karma reporter that will export your test data in the form of JSON but keys all describe contexts such as:

```
{
  "My Feature": {
    "should have a passing test": {
      "log": [],
      "time": 12,
      "status": "PASSED"
    },
    "might have a failing test": {
      "log": [
          "Expected undefined to equal 'input'."
          "http://localhost:9879/......./display.spec.js:44:36"
      ],
      "time": 14,
      "status": "FAILED"
    },
    "My Other Feature": {
      "should have a skipped test": {
          "log": [],
          "time": 0,
          "status": "SKIPPED"
      }
    }
  }
}
```

If an error occurs in the browser, will be written as

```
{
    "__BROWSER_ERRORS__": [
        "SyntaxError: Parse error",
        "at http://localhost:9877/base/app.spec.js?8e5e93760e0333550c0c67b01e552002b52e0166:31"
    ]
}
```

## Installation

```
npm install --save-dev karma-json-result-reporter
```

In your `karma.conf.js` add
 - `'karma-json-result-reporter'` to your plugins
 - `'json-result'` to your reporters

```
plugins: [
    ...
    'karma-json-result-reporter',
    ...
  ];

reporters: [
    'json-result'
    ...
  ],
```

You will also need to set the location that you need to output your JSON file.

```
jsonResultReporter: {
  outputFile: "karma-result.json",
  isSynchronous: true (optional, default false)
}
```


------------------------

_karma-json-result-reporter is inspired by [karma-spec-json-reporter](https://github.com/mackstar/karma-spec-json-reporter)_
