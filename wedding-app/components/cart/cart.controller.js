(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('CartCtrl', CartCtrl);

  CartCtrl.$inject = ['$scope', '$log', '$window', '$modal', 'cartSvc'];

  function CartCtrl($scope, $log, $window, $modal, cartSvc) {
    $window.scrollTo(0, 0);

    var vm = this;
    initialize();

    vm.removeCartItem = removeCartItem;
    vm.checkout = checkout;

    function removeCartItem(itemId) {
      var newCartItems = _.filter(vm.cart.items, function(id) { return id.itemId !== itemId; });
      cartSvc.saveCartItems(newCartItems);
      $log.debug("Removed item with id=" + itemId);
    }

    function checkout() {
      var modalInstance = $modal.open({
        templateUrl: 'checkout.html',
        controller: 'CheckoutModalCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          cartItems: function() { return vm.cart.items; },
          totalPrice: function() { return vm.cart.totalPrice; }
        }
      });

      modalInstance.result.then(function (status) {
        $log.debug('Modal OKed at: ' + new Date());
        $window.scrollTo(0, 0);
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });
    }

    function updateTotalPrice() {
      var itemPrices = _.map(vm.cart.items, function(item) {
        return item.price;
      });
      vm.cart.totalPrice = _.reduce(itemPrices, function(price1, price2) {
        return price1 + price2;
      }, 0);
    }

    function updateIsEmpty() {
      vm.cart.isEmpty = (vm.cart.items.length === 0);
    }

    function initialize() {
      cartSvc.loadCartItems();
      vm.cart = cartSvc.getCart();

      $scope.$watch(function() { return vm.cart.items; }, function() {
        updateTotalPrice();
        updateIsEmpty();
      });
    }
  }
})();
