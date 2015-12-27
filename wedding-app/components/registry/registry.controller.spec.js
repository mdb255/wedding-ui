/**
 * Created by Mike on 11/8/2015.
 */

'use strict';

describe("Registry Controller test", function() {
  beforeEach(module("weddingApp"));

  var scope, mWindow, mCartSvc, mSimpleModalsSvc;
  var existingCartItem = { itemId: 1, price: 50, description: 'des1', imageUrl: 'img1.jpg' };

  beforeEach(inject(function ($controller, $rootScope) {
    // Initialize controllers with mock injections
    scope = $rootScope.$new();
    mWindow = {
      scrollTo: jasmine.createSpy('scrollTo'),
      location: {}
    };
    mSimpleModalsSvc = { openSimpleModal: jasmine.createSpy('openSimpleModal') };
    mCartSvc = {
      loadCartItems: function() { return [existingCartItem]; },
      saveCartItems: jasmine.createSpy('saveCartItems')
    };

    $controller('RegistryCtrl', {
      $scope: scope,
      $window: mWindow,
      simpleModalsSvc: mSimpleModalsSvc,
      cartSvc: mCartSvc
    });
  }));

  it("should scroll to the top of the page", function() {
    // When the controller is loaded, it should automatically scroll to top of page
    expect(mWindow.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  describe("Add-to-Cart validation", function() {

    it("should show error for missing amount", function() {
      var regItem = {};
      var form = {
        $valid: false,
        amount: { $error: { required: true } },
        description: { $error: { required: true } }
      };

      scope.addToCart(regItem, form);

      expect(mCartSvc.saveCartItems.calls.count()).toBe(0);
      expect(mSimpleModalsSvc.openSimpleModal).toHaveBeenCalledWith("Oops!", "Please choose an amount for your gift.", "sm");
    });

    it("should show error for missing description", function() {
      var regItem = {};
      var form = {
        $valid: false,
        amount: { $error: { required: false } },
        description: { $error: { required: true } }
      };

      scope.addToCart(regItem, form);

      expect(mCartSvc.saveCartItems.calls.count()).toBe(0);
      expect(mSimpleModalsSvc.openSimpleModal).toHaveBeenCalledWith("Oops!", "Please enter a description for your gift.", "sm");
    });

    it("should add the new item to cart", function() {
      var regItem = { registryItemId: 2, selectedPrice: '100', description: 'des2', imageUrl: 'img2.jpg' };
      var newCartItem = { itemId: 2, price: 100, description: 'des2', imageUrl: 'img2.jpg' };
      var form = {
        $valid: true
      };

      scope.addToCart(regItem, form);

      expect(mCartSvc.saveCartItems).toHaveBeenCalledWith([existingCartItem, newCartItem]);
    });
  });

});
