/**
 * Created by Mike on 11/8/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .factory('cartModel', cartModel);

  cartModel.$inject = [];

  function cartModel() {
    return {
      cart: {
        items: {}
      }
    };
  }
})();
