(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('RegistryCtrl', RegistryCtrl);

  RegistryCtrl.$inject = ['$scope', '$log', '$location', '$window', '$http', 'localStorageService', 'simpleModalsSvc', 'cartSvc', 'appConfig'];

  function RegistryCtrl($scope, $log, $location, $window, $http, localStorageService, simpleModalsSvc, cartSvc, appConfig) {

    $window.scrollTo(0, 0);

    initialize();

    $scope.addToCart = addToCart;

    function addToCart(regItem, form) {
      $scope.isFS = true; // Is form submitted?

      if (form.$valid) {
        var cartItems = cartSvc.loadCartItems();
        $log.debug("Previous cart: " + JSON.stringify(cartItems));

        var newItem = { itemId: regItem.registryItemId, price: parseInt(regItem.selectedPrice), description: regItem.description, imageUrl: regItem.imageUrl };
        cartItems.push(newItem);

        $log.debug("Added new item: " + JSON.stringify(newItem));

        cartSvc.saveCartItems(cartItems);

        $window.location.href = "#/cart";
      } else {
        var errorMsg = "N/A";

        if (form.amount.$error.required) {
          errorMsg = "Please choose an amount for your gift.";
        } else if (form.description.$error.required) {
          errorMsg = "Please enter a description for your gift.";
        }

        simpleModalsSvc.openSimpleModal("Oops!", errorMsg, "sm");
      }
    }

    function initialize() {
      if (!localStorageService.isSupported) {
        simpleModalsSvc.openSimpleModal("Uh oh!", "It appears you are using an outdated browser that doesn't support our registry page. Please upgrade your browser if you would like to use it.", "md");
      }

      $scope.category = $location.search().category;

      if ($scope.category === undefined) {
        $scope.category = "none";
      } else {
        $http.get(appConfig.apiUrl + '/registryItems?category=' + $scope.category).success(function(data) {
          $log.debug("data: " + JSON.stringify(data));

          _.each(data, function(ri) {
            if (_.some(cartSvc.loadCartItems(), function(ci) { return ci.itemId === ri.registryItemId; })) {
              ri.isInCart = true;
            }
            if (ri.prices.length == 1) {
              // Auto-select price if there is only one choice
              ri.selectedPrice = ri.prices[0];
            }
          });
          $scope.registryItems = data;
        });
      }

      $log.debug("Registry category: " + $scope.category);

      setDefaults();
    }

    function setDefaults() {
      $scope.pages = [
        { id: "reg-trans", title: "Transportation", subtitle: "Subtitle", category: "transportation" },
        { id: "reg-accom", title: "Accommodations", subtitle: "Subtitle", category: "accommodations" },
        { id: "reg-dining", title: "Wining & Dining", subtitle: "Subtitle", category: "wining and dining" },
        { id: "reg-explore", title: "Explorations", subtitle: "Subtitle", category: "explorations" },
        { id: "reg-relax", title: "Relaxation", subtitle: "Subtitle", category: "relaxation" }
      ];
    }
  }
})();
