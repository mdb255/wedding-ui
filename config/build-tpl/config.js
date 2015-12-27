/**
 * Created by Mike on 5/4/2015.
 */

(function() {
  'use strict';

  angular.module('appConfig',[])
    .constant('appConfig',
    {
      'apiUrl': '@@apiUrl',
      'webRootPath': '@@webRootPath'
    });
})();
