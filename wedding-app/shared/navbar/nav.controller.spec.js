/**
 * Created by Mike on 11/9/2015.
 */

'use strict';

describe("Nav Controller test", function() {
  beforeEach(module("weddingApp"));

  var scope, mCartSvc;
  var cartItem1 = { itemId: 1, price: 50, description: 'des1', imageUrl: 'img1.jpg' };
  var cartItem2 = { itemId: 2, price: 100, description: 'des2', imageUrl: 'img2.jpg' };

  beforeEach(inject(function ($controller, $rootScope) {
    // Initialize controllers with mock injections
    scope = $rootScope.$new();
    mCartSvc = {
      loadCartItems: function() { },
      getCart: function() { return { items: [cartItem1] }; }
    };

    $controller('NavCtrl', {
      $scope: scope,
      cartSvc: mCartSvc
    });
  }));

  it("should start with 1 cart item", function() {
    scope.$apply();

    expect(scope.cart.items).toEqual([cartItem1]);
  });

  it("should have updated count after items change", function() {
    scope.cart.items.push(cartItem2);
    scope.$apply();

    expect(scope.cartItemCount).toBe(2);
  });

  it("should have updated visibility after removing items", function() {
    scope.cart.items.pop();
    scope.$apply();

    expect(scope.isCartCounterVisible).toBe(false);
  });
});
