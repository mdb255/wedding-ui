/**
 * Created by Mike on 11/9/2015.
 */

'use strict';

describe("Cart Controller test", function() {
  beforeEach(module("weddingApp"));

  var scope, mWindow, mCartSvc;
  var existingCartItem1 = { itemId: 1, price: 50, description: 'des1', imageUrl: 'img1.jpg' };
  var existingCartItem2 = { itemId: 2, price: 100, description: 'des2', imageUrl: 'img2.jpg' };

  beforeEach(inject(function ($controller, $rootScope) {
    // Initialize controllers with mock injections
    scope = $rootScope.$new();
    mWindow = { scrollTo: jasmine.createSpy('scrollTo') };
    mCartSvc = {
      loadCartItems: function() { },
      getCart: function() { return { items: [existingCartItem1, existingCartItem2] }; },
      saveCartItems: jasmine.createSpy('saveCartItems')
    };

    $controller('CartCtrl as vm', {
      $scope: scope,
      $window: mWindow,
      cartSvc: mCartSvc
    });
  }));

  it("should scroll to the top of the page", function() {
    // When the controller is loaded, it should automatically scroll to top of page
    expect(mWindow.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should start with a total of $150", function() {
    scope.$apply();

    expect(scope.vm.cart.totalPrice).toBe(150);
  });

  it("should start out not being empty", function() {
    scope.$apply();

    expect(scope.vm.cart.isEmpty).toBe(false);
  });

  it("should have a total price of $0 after clearing", function() {
    scope.vm.cart.items.length = 0;
    scope.$apply();

    expect(scope.vm.cart.totalPrice).toBe(0);
  });

  it("should be empty after clearing", function() {
    scope.vm.cart.items.length = 0;
    scope.$apply();

    expect(scope.vm.cart.isEmpty).toBe(true);
  });

  describe("Cart functionality", function() {

    it("should have item1 left after removing item2", function() {
      scope.vm.removeCartItem(2);

      expect(mCartSvc.saveCartItems).toHaveBeenCalledWith([existingCartItem1]);
    });
  });

});
