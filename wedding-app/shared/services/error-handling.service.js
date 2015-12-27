/**
 * Created by Mike on 10/31/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .factory('errorHandlingSvc', errorHandlingSvc);

  errorHandlingSvc.$inject = ['$log', 'simpleModalsSvc'];

  function errorHandlingSvc($log, simpleModalsSvc) {
    var service = {
      handleHttpError: handleHttpError
    };
    return service;

    function handleHttpError(errorContext, statusCode) {
      $log.debug(format("Http error occurred. context={0}, statusCode={1}", errorContext, statusCode));
      return simpleModalsSvc.openSimpleErrorModal(errorContext);
    }
  }
})();
