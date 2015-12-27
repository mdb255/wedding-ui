/**
 * Created by Mike on 10/22/2015.
 */

'use strict';

describe("Rsvp Controller test", function() {
  beforeEach(module("weddingApp"));

  var scope, mWindow;

  beforeEach(module(function($provide) {
    // Use mWindow as a mock impl for $window
    mWindow = { scrollTo: jasmine.createSpy() };
    $provide.value('$window', mWindow);
  }));

  beforeEach(inject(function ($controller, $rootScope) {
    // Initialize controllers
    scope = $rootScope.$new();
    $controller('NavCtrl', { $scope: scope });
    $controller('RsvpCtrl', { $scope: scope });
  }));

  it("should scroll to the top of the page", function() {
    // When the RsvpCtrl is loaded, it should automatically scroll to top of page
    expect(mWindow.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  describe("RSVP form validation", function() {

    it("should be invalid because no attendance option chosen for self", function() {
      var selfForm = { $valid: true };
      var guestForm = { $valid: true };
      scope.storeForms(selfForm, guestForm);

      scope.submit();
      expect(scope.rsvps[0].errAttdNotSelected).toBeTruthy();
      expect(scope.isSubmitSuccess).toBeFalsy();
    });

    it("should be invalid because guest form is active but not valid", function() {
      var selfForm = { $valid: true };
      var guestForm = { $valid: false };
      scope.storeForms(selfForm, guestForm);
      scope.rsvps[1].isActive = true;

      scope.submit();
      expect(scope.isSubmitSuccess).toBeFalsy();
    });

    it("should be invalid because bad attendance combo chosen for guest", function() {
      var selfForm = { $valid: true };
      var guestForm = { $valid: true };
      scope.storeForms(selfForm, guestForm);
      scope.rsvps[1].isActive = true;
      scope.rsvps[1].attdReception = true;
      scope.rsvps[1].attdNone = true;

      scope.submit();
      expect(scope.rsvps[1].errAttdBadCombo).toBeTruthy();
      expect(scope.isSubmitSuccess).toBeFalsy();
    });

    it("should be valid for self-only submission", function() {
      var selfForm = { $valid: true };
      var guestForm = { $valid: true };
      scope.storeForms(selfForm, guestForm);
      scope.rsvps[0].attdReception = true;
      scope.rsvps[1].isActive = false;

      scope.submit();
      expect(scope.isSubmitSuccess).toBeTruthy();
    });

    it("should be valid for self + guest submission", function() {
      var selfForm = { $valid: true };
      var guestForm = { $valid: true };
      scope.storeForms(selfForm, guestForm);
      scope.rsvps[0].attdReception = true;
      scope.rsvps[0].attdBoat = true;
      scope.rsvps[1].isActive = true;
      scope.rsvps[1].attdNone = true;

      scope.submit();
      expect(scope.isSubmitSuccess).toBeTruthy();
    });
  });

});