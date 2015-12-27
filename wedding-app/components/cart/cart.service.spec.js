/**
 * Created by Mike on 11/1/2015.
 */

'use strict';

describe("Cart Service test", function() {
  beforeEach(module("weddingApp"));

  var cartSvc;

  beforeEach(inject(function($injector) {
    cartSvc = $injector.get('cartSvc');
  }));

  it("should initially be null", function() {
    var cartItems = cartSvc.loadCartItems();
    expect(cartItems).toEqual([]);
  });

  it("should contain the items after saving", function() {
    var itemsToSave = [
      {"itemId":9,"price":100,"description":"Hotel in Venice","imageUrl":"Hotel in Venice.jpeg"},
      {"itemId":10,"price":150,"description":"Hotel in Rome","imageUrl":"Hotel in Rome.jpeg"}];

    cartSvc.saveCartItems(itemsToSave);
    var cartItems = cartSvc.loadCartItems();

    expect(cartItems).toEqual(itemsToSave);
  });

  it("should be null after adding items and then clearing", function() {
    var itemsToSave = [{"itemId":9,"price":100,"description":"Hotel in Venice","imageUrl":"Hotel in Venice.jpeg"}];

    cartSvc.saveCartItems(itemsToSave);
    cartSvc.clearCart();
    var cartItems = cartSvc.loadCartItems();

    expect(cartItems).toEqual([]);
  });
});
