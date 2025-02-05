// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: [
        'jasmine',
        '@angular-devkit/build-angular'
      ],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-mocha-reporter'),
        require('karma-jasmine-html-reporter'),
        require('karma-junit-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false, // leave Jasmine Spec Runner output visible in browser
        captureConsole: false,
      },
      reporters: ['progress', 'coverage'],
      coverageReporter: {
        // specify a common output directory
        dir: require('path').join(__dirname, './coverage'),
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          // reporters supporting the `file` property, use `subdir` to directly
          // output them in the `dir` directory
          { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
          { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
          { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
          { type: 'text', subdir: '.', file: 'text.txt' },
          { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
        ]
      },
      junitReporter: {
        outputDir: 'testresults',
      },
      mochaReporter: {
        output: 'minimal'
      },
      jasmineDiffReporter: {
        legacy: true
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      browserConsoleLogOptions: {level: "warn"},
      autoWatch: true,
      browsers: ['ChromeHeadlessCustom', 'ChromeDebug'],
      customLaunchers: {
        ChromeHeadlessCustom: {
          base: "ChromeHeadless",
          flags: [
            "--no-sandbox", // required to run without privileges in a container
            "--user-data-dir=/tmp/chrome-test-profile",
            "--disable-web-security",
            "--remote-debugging-port=9222",
            '--disable-gpu'
          ],
          debug: true,
        },
        ChromeDebug: {
          base: 'Chrome',
          flags: [ '--remote-debugging-port=9333' ]
        }
      },
      singleRun: false,
      restartOnFileChange: true,
      captureTimeout: 90000,
      browserNoActivityTimeout: 90000,
      pingTimeout: 60000,
      processKillTimeout: 6000,
      browserDisconnectTimeout: 10000,
    });
  };