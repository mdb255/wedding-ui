'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Home tests', function() {

  browser.get('#/home');

  it('should show the Home nav tab as active', function() {
    var activeLink = element(by.css("div.active-nav a"));

    expect(activeLink.getText()).toEqual("HOME");
  });
});
