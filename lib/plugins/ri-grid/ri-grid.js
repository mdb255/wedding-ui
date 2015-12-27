/**
 * Created by Mike on 4/13/2015.
 */

'use strict';

$(function() {
  $('#ri-grid').gridrotator( {
    animSpeed: 300,
    animType: 'rotateBottom',
    slideshow: false,
    onhover: true,

    // number of rows
    rows: 1,
    // number of columns
    columns: 3,

    w320: {
      rows: 3,
      columns: 4
    },
    w240: {
      rows: 3,
      columns: 3
    }
  });
});