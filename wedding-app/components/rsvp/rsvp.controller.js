(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('RsvpCtrl', RsvpCtrl);

  RsvpCtrl.$inject = ['$scope', '$log', '$http', '$window', 'errorHandlingSvc', 'simpleModalsSvc', 'appConfig'];

  function RsvpCtrl($scope, $log, $http, $window, errorHandlingSvc, simpleModalsSvc, appConfig) {

    $window.scrollTo(0, 0);

    setDefaults();

    $scope.storeForms = storeForms;
    $scope.submit = submit;

    function storeForms(form1, form2) {
      if (form1 !== undefined) {
        $scope.selfForm = form1;
      }
      if (form2 !== undefined) {
        $scope.guestForm = form2;
      }
    }

    function submit() {
      $scope.isFS = true; // Is form submitted?

      // Validation
      var isFormValid = $scope.selfForm.$valid && (!$scope.rsvps[1].isActive || $scope.guestForm.$valid);
      var isAllValid = true;

      _.each($scope.rsvps, function(r) {
        if (r.isActive) {
          r.errAttdNotSelected = (!r.attdReception && !r.attdBoat && !r.attdNone);
          r.errAttdBadCombo = (r.attdNone && (r.attdReception || r.attdBoat));
          isAllValid = isFormValid && !r.errAttdNotSelected && !r.errAttdBadCombo;
        }
      });

      if (isAllValid) {
        $scope.isSubmitSuccess = true;

        var activeRsvps = _.filter($scope.rsvps, function(r) {
          return r.isActive;
        });
        _.each(activeRsvps, function(r) {
          // The submitter's information is in the first RSVP form
          r.submitterEmail = activeRsvps[0].email;
        });

        $log.debug(JSON.stringify(activeRsvps));

        $http.post(appConfig.apiUrl + '/rsvps', activeRsvps).
          success(function(data) {
            simpleModalsSvc.openSimpleModal("Success!", "We've received your RSVP. Thanks for responding!", "sm")
              .result.then(function (status) {
                $window.location.href = "#/home";
              });

            $log.debug("rsvp post reply: " + JSON.stringify(data));
          }).
          error(function(data, status) {
            errorHandlingSvc.handleHttpError("submitting your RSVP", status);
          });
      }
    }

    function setDefaults() {
      $scope.isFS = false;
      $scope.isSubmitSuccess = false;

      $scope.dinnerMenu = {
        'Sun-dried Tomato Chicken': 'Sun-dried Tomato, Artichoke & Basil Stuffed Chicken Breast, Golden Whipped Mashed Potatoes, Baby Vegetables, and a Balsamic Reduction',
        'Filet Mignon': 'Sea Salt Rosemary Encrusted Filet Mignon, Truffle Roasted Fingerling Potatoes and Grilled Asparagus',
        'Spinach & Portabella Mushroom': 'Jasmine Rice Topped with a Garlic and Spinach Saute, Grilled Summer Vegetables and Portabella Mushroom and drizzled with Balsamic Glaze and Basil Oil'
      };

      $scope.dinnerChoices = Object.keys($scope.dinnerMenu);

      $log.debug(Object.keys($scope.dinnerMenu));

      // Default values
      var rsvpSelf = {};
      rsvpSelf.guestType = "self";
      rsvpSelf.isActive = true;

      var rsvpGuest = {};
      rsvpGuest.guestType = "guest";
      rsvpGuest.isActive = false;

      $scope.rsvps = [rsvpSelf, rsvpGuest];

      _.each($scope.rsvps, function(r) {
        r.dinner = '';
        r.dessert = '';
        r.attdReception = false;
        r.attdBoat = false;
        r.attdNone = false;
      });
    }
  }
})();
