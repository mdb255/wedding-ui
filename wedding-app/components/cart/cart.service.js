/**
 * Created by Mike on 10/31/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .factory('cartSvc', cartSvc);

  cartSvc.$inject = ['$log', 'localStorageService', 'cartModel'];

  function cartSvc($log, localStorageService, cartModel) {
    var service = {
      getCart: getCart,
      loadCartItems: loadCartItems,
      saveCartItems: saveCartItems,
      clearCart: clearCart
    };
    return service;

    function getCart() {
      return cartModel.cart;
    }

    function loadCartItems() {
      var result = [];
      // TODO extract constant
      var cartItemsStr = localStorageService.get('amwedding.cartItems');

      // TODO validate the stored data
      if (cartItemsStr !== undefined && cartItemsStr !== null) {
        result = JSON.parse(cartItemsStr);
      }

      updateCartItems(result);
      return result;
    }

    // TODO expose add + remove instead of save?
    function saveCartItems(items) {
      updateCartItems(items);
      localStorageService.set('amwedding.cartItems', JSON.stringify(items));
      $log.debug("Saved items to cart: " + JSON.stringify(items));
    }

    function clearCart() {
      localStorageService.remove('amwedding.cartItems');
      updateCartItems([]);
      $log.debug("Cleared cart!");
    }

    /** Private **/

    function updateCartItems(cartItems) {
      cartModel.cart.items = cartItems;
    }
  }
})();
