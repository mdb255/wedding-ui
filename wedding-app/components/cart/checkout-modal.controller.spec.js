/**
 * Created by Mike on 11/12/2015.
 */

'use strict';

describe("Checkout Modal Controller test", function() {
  beforeEach(module("weddingApp"));

  var scope, mModalInstance, mWindow;
  var $httpBackend, purchasesHandler;
  var existingCartItem1 = { itemId: 1, price: 50, description: 'nice item1', imageUrl: 'img1.jpg' };
  var existingCartItem2 = { itemId: 2, price: 100, description: 'nice item2', imageUrl: 'img2.jpg' };

  beforeEach(inject(function ($controller, $rootScope, $injector) {
    // Initialize controllers with mock injections
    scope = $rootScope.$new();
    mModalInstance = { dismiss: jasmine.createSpy('dismiss') };
    mWindow = { open: jasmine.createSpy('open') };

    $controller('CheckoutModalCtrl', {
      $scope: scope,
      $modalInstance: mModalInstance,
      $window: mWindow,
      cartSvc: { clearCart: jasmine.createSpy('clearCart') },
      errorHandlingSvc: { handleHttpError: jasmine.createSpy('handleHttpError') },
      cartItems: [existingCartItem1, existingCartItem2],
      totalPrice: {},
      appConfig: { apiUrl: 'mock.url' }
    });

    $httpBackend = $injector.get('$httpBackend');
    purchasesHandler = $httpBackend.when('POST', 'mock.url/purchases');
  }));

  it("should not submit successfully", function() {
    scope.submit(false);

    expect(scope.isSubmitSuccess).toBe(false);
  });

  it("should have success state and clear cart on request success", function() {
    purchasesHandler.respond(200, '');
    $httpBackend.expectPOST('mock.url/purchases');

    scope.submit(true);
    $httpBackend.flush();

    expect(scope.isReqSuccess).toBe(true);
  });

  it("should dismiss the modal on request failure", function() {
    purchasesHandler.respond(500, '');
    $httpBackend.expectPOST('mock.url/purchases');

    scope.submit(true);
    $httpBackend.flush();

    expect(scope.isReqSuccess).toBe(false);
    expect(mModalInstance.dismiss).toHaveBeenCalledWith('error');
  });

  it("should open a new tab with gift url", function() {
    // Mock a return value
    mWindow.open.and.returnValue({ print: function() {} });

    scope.fromNames = 'person one and two';
    scope.print();

    var giftUrl = 'wedding-app/components/gift-card/gift.html#/?from=person%20one%20and%20two&items=%5B%22nice%20item1%22%2C%22nice%20item2%22%5D';
    // toHaveBeenCalledWith doesn't work with andReturn for some reason. This is a workaround.
    expect(mWindow.open.calls.count()).toBe(1);
    expect(mWindow.open.calls.mostRecent().args[0]).toBe(giftUrl);
  });
});
