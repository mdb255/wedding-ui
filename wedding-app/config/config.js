/**
 * Created by Mike on 5/4/2015.
 */

(function() {
  'use strict';

  angular.module('appConfig',[])
    .constant('appConfig',
    {
      'apiUrl': 'http://localhost:8080/wedding-ws/v1',
      'webRootPath': '/src/wedding-website/app/'
    });
})();
