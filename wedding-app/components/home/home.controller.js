(function() {
  'use strict';

  angular
    .module('weddingApp')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$window', 'simpleModalsSvc'];

  function HomeCtrl($scope, $window, simpleModalsSvc) {

    $window.scrollTo(0, 0);

    if ($window.screen.width < 1200) {
      simpleModalsSvc.openSimpleModal("Hello!", "We noticed based on your screen size that you are using a mobile device. While the site does support this, you'll still get the optimal experience on a laptop or desktop. Enjoy!", "md");
    }

    $scope.whenSlideShowReady = whenSlideShowReady;

    $scope.imgFilenames = [
      "r1.jpg",
      "g1.jpg",
      "b1.jpg",
      "r2.jpg",
      "g2.jpg",
      "b2.jpg",
      "r3.jpg",
      "g3.jpg",
      "b3.jpg"
      // FIXME Add custom photos for slideshow
    ];

    function whenSlideShowReady() {
      $('#ri-grid').gridrotator( {
        rows: 3,
        columns: 5,

        animSpeed: 700,
        animType: 'random',
        interval: 4000,
        minStep: 3,
        maxStep: 7,

        preventClick: false,

        w1024: {
          rows: 3,
          columns: 5
        },
        w768: {
          rows: 4,
          columns: 3
        },
        w480: {
          rows: 4,
          columns: 3
        },
        w320: {
          rows: 4,
          columns: 3
        },
        w240: {
          rows: 4,
          columns: 3
        }
      });
    }
  }
})();
