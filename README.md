# wedding-ui: A Wedding Website front-end template
Template for a single-page Wedding Website app with RSVP and Registry

See the back-end project here: https://github.com/mdb255/wedding

## Quick Start
At the wedding-ui root:
```sh
$ npm install  # Install node dependencies (for gulp, tests, etc.)
$ bower install  # Install bower dependencies (for browser app)
```
```sh
$ gulp watch-build  # Watch for changes to app files and build into app-bundle.min.js
```
```sh
$ gulp replace  # Set environment config to dev
$ npm start  # Launch http-server on port 8090 to host the UI
```
```sh
$ npm test  # Run Karma unit tests
```

Follow setup steps to install Protractor and launch a Selenium server: 
https://github.com/angular/protractor/blob/master/docs/tutorial.md (also requires that the back-end is up and running)
```sh
$ protractor e2e-tests/protractor.conf.js  # Run Protractor end-to-end tests
```

**Now ready to apply images and details for a custom wedding event**

## Misc
##### Disclaimers:
* Fully tested in Chrome only; Some testing in latest IE, Firefox, Safari
* Has not been reviewed for security issues and should not be used for sensitive data

##### Plugins:
* Animated Responsive Image Grid: http://tympanus.net/codrops/2012/08/02/animated-responsive-image-grid/

[AngularJS]: http://angularjs.org
[Twitter Bootstrap]: http://twitter.github.com/bootstrap
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[protractor]: https://github.com/angular/protractor
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[http-server]: https://github.com/nodeapps/http-server
[Gulp]: http://gulpjs.com
