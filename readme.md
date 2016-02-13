# Karma JSON result reporter

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
          "Expected undefined to equal 'input'.\nhttp://localhost:9879/......./display.spec.js:44:36"
      ],
      "time": 14,
      "status": "FAILED"
    },
    "My Other Feature": {
      "should have a skipped test": {
          "log": [],
          "time": 0,
          "status": "SKIPPED"
      },
    }
  }
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
  outputFile: "karma-result.json"
}
```


------------------------

_karma-json-result-reporter is inspired by [karma-spec-json-reporter](https://github.com/mackstar/karma-spec-json-reporter)_
