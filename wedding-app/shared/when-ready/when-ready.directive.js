/*
 * Source: http://stackoverflow.com/questions/14968690/sending-event-when-angular-js-finished-loading
 * Author: trusktr
 */

/*
 * The whenReady directive allows you to execute the content of a when-ready
 * attribute after the element is ready (i.e. done loading all sub directives and DOM
 * content except for things that load asynchronously like partials and images).
 *
 * Execute multiple expressions by delimiting them with a semi-colon. If there
 * is more than one expression, and the last expression evaluates to true, then
 * all expressions prior will be evaluated after all text nodes in the element
 * have been interpolated (i.e. {{placeholders}} replaced with actual values). 
 *
 * Caveats: if other directives exists on the same element as this directive
 * and destroy the element thus preventing other directives from loading, using
 * this directive won't work. The optimal way to use this is to put this
 * directive on an outer element.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .directive('whenReady', ['$interpolate', function($interpolate) {
    return {
      restrict: 'A',
      priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
      link: function($scope, $element, $attributes) {
        var expressions = $attributes.whenReady.split(';');
        var waitForInterpolation = false;

        function evalExpressions(expressions) {
          expressions.forEach(function(expression) {
            $scope.$eval(expression);
          });
        }

        if ($attributes.whenReady.trim().length == 0) { return; }

        if (expressions.length > 1) {
          if ($scope.$eval(expressions.pop())) {
            waitForInterpolation = true;
          }
        }

        if (waitForInterpolation) {
          requestAnimationFrame(function checkIfInterpolated() {
            if ($element.text().indexOf($interpolate.startSymbol()) >= 0) { // if the text still has {{placeholders}}
              requestAnimationFrame(checkIfInterpolated);
            }
            else {
              evalExpressions(expressions);
            }
          });
        }
        else {
          evalExpressions(expressions);
        }
      }
    };
  }]);
})();