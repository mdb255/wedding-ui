/**
 * Created by Mike on 11/7/2015.
 */

(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('CheckoutModalCtrl', CheckoutModalCtrl);

  CheckoutModalCtrl.$inject = ['$scope', '$log', '$modalInstance', '$http', '$window',
    'cartSvc', 'errorHandlingSvc', 'cartItems', 'totalPrice', 'appConfig'];

// TODO refactor cartItems/totalPrice into one object
  function CheckoutModalCtrl($scope, $log, $modalInstance, $http, $window,
                             cartSvc, errorHandlingSvc, cartItems, totalPrice, appConfig) {

    $scope.submit = submit;
    $scope.cancel = cancel;
    $scope.ok = ok;
    $scope.print = print;

      $scope.checkoutItems = cartItems;
    $scope.checkoutTotal = totalPrice;
    $scope.deliveryMethod = "";
    $scope.isFS = false;
    $scope.isSubmitSuccess = false;
    $scope.isReqSuccess = false;

    function submit(isFormValid) {
      $scope.isFS = true;

      if (isFormValid) {
        $scope.isSubmitSuccess = true;

        var mapCheckoutItemToPurchase = function(checkoutItem) {
          var result = {};
          result.registryItemId = checkoutItem.itemId;
          result.price = checkoutItem.price;
          result.customDescription = checkoutItem.description;
          result.purchasedByNames = $scope.fromNames;
          result.purchasedByEmail = $scope.fromEmail;
          result.deliveryMethod = $scope.deliveryMethod;

          return result;
        };

        var purchaseVmList = _.map($scope.checkoutItems, mapCheckoutItemToPurchase);

        $http.post(appConfig.apiUrl + '/purchases', purchaseVmList).
          success(function(data) {
            $scope.isReqSuccess = true;
            $log.debug("purchase post reply: " + JSON.stringify(data));
            cartSvc.clearCart();
          }).
          error(function(data, status) {
            $modalInstance.dismiss('error');
            errorHandlingSvc.handleHttpError("submitting your registry choices", status);
          });
      }
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function ok() {
      $modalInstance.close('ok');
    }

    function print() {
      var giftWindow = $window.open(createLink(), '_blank');
      giftWindow.print();
    }

    function createLink() {
      var itemDescs = _.map($scope.checkoutItems, function(item) { return item.description; });
      var itemDescsStr = JSON.stringify(itemDescs);
      var result = 'wedding-app/components/gift-card/gift.html#/?from=' + encodeURIComponent($scope.fromNames) + '&items=' + encodeURIComponent(itemDescsStr);
      return result;
    }
  }
})();
