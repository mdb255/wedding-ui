(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('NavCtrl', NavCtrl);

  NavCtrl.$inject = ['$scope', 'cartSvc'];

  function NavCtrl($scope, cartSvc) {
    cartSvc.loadCartItems();
    $scope.cart = cartSvc.getCart();

    $scope.$watch(function() { return $scope.cart.items; }, function() {
      updateCartItemCount();
      updateIsCartCounterVisible();
    });

    $scope.tabs = [
      { path: "#/home", label: "Home" },
      { path: "#/venue", label: "Venue" },
      { path: "#/rsvp", label: "RSVP" },
      { path: "#/hotels", label: "Hotels" },
      { path: "#/registry", label: "Registry" },
      { path: "#/cart", label: "" }
    ];

    function updateCartItemCount() {
      $scope.cartItemCount = $scope.cart.items.length;
    }

    function updateIsCartCounterVisible() {
      $scope.isCartCounterVisible = ($scope.cart.items.length > 0);
    }
  }
})();
