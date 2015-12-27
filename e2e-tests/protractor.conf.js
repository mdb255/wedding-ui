exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../bower_components/jquery/dist/jquery.js',
    'home.e2e-spec.js',
    'registry.e2e-spec.js'
    // TODO add automation coverage for other static pages, RSVPs, custom registry gifts
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8090/',

  //seleniumPort: 16419,

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
