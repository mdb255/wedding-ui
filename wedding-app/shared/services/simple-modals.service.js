/**
 * Created by Mike on 10/31/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .factory('simpleModalsSvc', simpleModalsSvc);

  simpleModalsSvc.$inject = ['$modal'];

  function simpleModalsSvc($modal) {
    var service = {
      openSimpleModal: openSimpleModal,
      openSimpleErrorModal: openSimpleErrorModal,
      openUnsentErrorModal: openUnsentErrorModal
    };
    return service;

    function openSimpleModal(title, message, windowSize) {
      return $modal.open({
        templateUrl: 'simple-ok-modal.html',
        controller: 'SimpleModalCtrl',
        backdrop: 'static',
        size: windowSize,
        resolve: {
          title: function() { return title; },
          message: function() { return message; }
        }
      });
    }

    function openSimpleErrorModal(errorContext) {
      return openSimpleModal("Uh oh!", "Sorry, something went wrong on our side " + errorContext + ". We'll be looking into the problem - please try again later.", "md");
    }

    function openUnsentErrorModal(errorContext) {
      return openSimpleModal("Uh oh!", "It looks like something went wrong " + errorContext + " - the information could not be sent. Please check your internet connection or try a different browser.", "md");
    }
  }
})();
