/**
 * Created by Mike on 11/8/2015.
 */

(function() {
  'use strict';

  angular.
    module('weddingApp').
    config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/rsvp', {
          templateUrl: '/wedding-app/components/rsvp/rsvp.html',
          controller: 'RsvpCtrl'
        })
        .when('/hotels', {
          templateUrl: '/wedding-app/components/hotels/hotels.html',
          controller: 'HotelsCtrl'
        })
        .when('/registry', {
          templateUrl: '/wedding-app/components/registry/registry.html',
          controller: 'RegistryCtrl'
        })
        .when('/home', {
          templateUrl: '/wedding-app/components/home/home.html',
          controller: 'HomeCtrl'
        })
        .when('/venue', {
          templateUrl: '/wedding-app/components/venue/venue.html',
          controller: 'VenueCtrl'
        })
        .when('/cart', {
          templateUrl: '/wedding-app/components/cart/cart.html',
          controller: 'CartCtrl',
          // TODO Switch the rest of the controllers to use this "controllerAs vm" syntax
          controllerAs: 'vm'
        });
      $routeProvider.otherwise({redirectTo: '/home'});
    }]);
})();
