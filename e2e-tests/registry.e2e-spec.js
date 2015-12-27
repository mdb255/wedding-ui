'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Registry tests', function() {

  var _ = require('lodash');
  var unirest = require('unirest');

  describe('Registry item', function() {

    var REG_ITEM_DETAILS_SELECTOR = "div.reg-item div.reg-item-details";
    var REG_ITEM_DESCRIPTION = "Train ride to Munich";
    var REG_ITEM_PRICE = "$100";
    var PURCHASED_BY_NAMES = "Test User1";
    var PURCHASED_BY_EMAIL = "user1@test1.com";
    var REST_OP_TIMEOUT_MS = 10000;

    beforeAll(function() {
      browser.controlFlow().execute(createRegItem);

      function createRegItem() {
        var isCreateRegItemDone = false;

        // Add a new Registry Item to the database
        var promiseToCreate = new Promise(function(resolve, reject) {
            unirest.post('http://localhost:8080/wedding-test-ws/registryItems')
              .type('json')
              .send({
                category: 'Transportation',
                isPurchasable: true,
                initialStock: 2,
                priceRange: '50,100,150',
                description: REG_ITEM_DESCRIPTION
              })
              .end(function(response) {
                expect(response.ok).toBe(true);
                resolve();
              });
          }
        );

        promiseToCreate.then(function() {
          isCreateRegItemDone = true;
        });

        browser.wait(function() {
          return isCreateRegItemDone;
        }, REST_OP_TIMEOUT_MS);
      }
    });

    it('purchase newly added registry item', function() {

      browser.get('#/registry?category=transportation');

      browser.controlFlow()
        .execute(findDescriptionTitle)
        .then(verifyDescriptionTitle)
        .then(findSubtitleSections)
        .then(verifySubtitleSections)
        .then(selectAmountOption);

      browser.controlFlow().execute(clickChooseButton);

      browser.controlFlow()
        .execute(findCartItem)
        .then(verifyItemPrice);

      browser.controlFlow().execute(verifyCartCounter);

      browser.controlFlow().execute(verifyCartTotal);

      browser.controlFlow()
        .execute(findCheckoutButton)
        .then(clickCheckoutButton);

      browser.controlFlow().execute(verifyCheckoutSummary);
      browser.controlFlow().execute(verifyCheckoutTotal);

      browser.controlFlow().execute(fillCheckoutForm);

      browser.controlFlow().execute(clickSubmitButton);

      browser.controlFlow().execute(retrieveAndVerifyNewPurchase);


      function findDescriptionTitle() {
        return element.all(by.css(REG_ITEM_DETAILS_SELECTOR + " div.reg-item-desc")).filter(function(elm, idx) {
          return elm.element(by.css("p.reg-item-title")).getText().then(function(text) {
            return text === REG_ITEM_DESCRIPTION;
          });
        });
      }

      function verifyDescriptionTitle(descriptionElms) {
        expect(descriptionElms.length).toBe(1);

        var regItemDescElm = descriptionElms[0];
        expect(regItemDescElm.isDisplayed()).toBe(true);

        return regItemDescElm;
      }

      function findSubtitleSections(descriptionElm) {
        // Find p sections within subtitles that are visible
        return descriptionElm.all(by.css("div.reg-item-subtitle p")).filter(elmIsDisplayedPredicate);
      }

      function verifySubtitleSections(subtitleElms) {
        // Expect 2 p elements within the subtitle
        expect(subtitleElms.length).toBe(2);

        // The 1st is Quantity available
        expect(subtitleElms[0].getText()).toBe("Quantity available: 2");

        // The 2nd is Amount
        var optionElms = subtitleElms[1].all(by.css("select option"));
        var optionLabels = optionElms.map(function(elm, idx) {
          return elm.getText();
        });

        expect(optionLabels).toEqual(['($50 to $150)', '$50', '$100', '$150']);

        return optionElms.filter(function(elm) {
          return elm.getText().then(function(text) {
            return text === REG_ITEM_PRICE;
          });
        });
      }

      function selectAmountOption(option100Elms) {
        expect(option100Elms.length).toBe(1);

        // Select price of $100
        option100Elms[0].click();
      }

      function clickChooseButton() {
        var buttonElms = element.all(by.xpath("//body/descendant::div[@class='reg-item-details']" +
        "/descendant::p[text()='" + REG_ITEM_DESCRIPTION + "']/parent::div" +
        "/parent::div/following-sibling::a[text()='Choose as Gift']"));

        // Expect one "choose" button
        expect(buttonElms.count()).toBe(1);

        buttonElms.get(0).click();

        // Should move to the cart page after clicking the button
        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '#/cart');
      }

      function findCartItem() {
        return element.all(by.css("div.cart-item")).filter(function(elm, idx) {
          return elm.element(by.css("div.cart-item-title p")).getText().then(function(text) {
            return text === REG_ITEM_DESCRIPTION;
          });
        });
      }

      function verifyItemPrice(cartItemElms) {
        expect(cartItemElms.length).toBe(1);
        expect(cartItemElms[0].element(by.css("div.cart-item-price p")).getText()).toBe(REG_ITEM_PRICE);
      }

      function verifyCartCounter() {
        var cartCounterElms = element.all(by.css("ul.nav div.circle span.cart-count")).filter(elmIsDisplayedPredicate);

        expect(cartCounterElms.count()).toBe(1);
        expect(cartCounterElms.get(0).getText()).toBe("1");
      }

      function verifyCartTotal() {
        var cartTotalElms = element.all(by.css("div.cart-menu-header p.cart-item-price-val")).filter(elmIsDisplayedPredicate);

        expect(cartTotalElms.count()).toBe(1);
        expect(cartTotalElms.get(0).getText()).toBe(REG_ITEM_PRICE);
      }

      function findCheckoutButton() {
        var checkoutBtnElms = element.all(by.css("div.cart-menu-header ~ a.btn"))
          .filter(elmIsDisplayedPredicate)
          .filter(_.bind(elmHasTextPredicate, null, _, "CHECKOUT"));

        expect(checkoutBtnElms.count()).toBe(1);

        return checkoutBtnElms;
      }

      function clickCheckoutButton(checkoutBtnElms) {
        checkoutBtnElms[0].click();
      }

      function verifyCheckoutSummary() {
        var checkoutSummaryElms = element.all(by.css("div.modal-dialog div.gift-summary li.preview-item"))
          .filter(elmIsDisplayedPredicate)
          .filter(_.bind(elmHasTextPredicate, null, _, REG_ITEM_DESCRIPTION));

        expect(checkoutSummaryElms.count()).toBe(1);
      }

      function verifyCheckoutTotal() {
        var checkoutTotalElms = element.all(by.css("div.modal-dialog div.gift-summary p.gift-total"))
          .filter(elmIsDisplayedPredicate)
          .filter(_.bind(elmHasTextPredicate, null, _, "Total amount: " + REG_ITEM_PRICE));

        expect(checkoutTotalElms.count()).toBe(1);
      }

      function fillCheckoutForm() {
        var entryFormElms = element.all(by.css("div.modal-dialog div.form-group"));

        expect(entryFormElms.count()).toBe(3);
        //return entryFormElms;

        var presentedByInputElms = entryFormElms.all(by.name("names"));
        expect(presentedByInputElms.count()).toBe(1);
        presentedByInputElms.get(0).sendKeys(PURCHASED_BY_NAMES);

        var fromEmailInputElms = entryFormElms.all(by.name("email"));
        expect(fromEmailInputElms.count()).toBe(1);
        fromEmailInputElms.get(0).sendKeys(PURCHASED_BY_EMAIL);

        var deliveryMethodInputElms = entryFormElms.all(by.name("deliveryMethod"));
        expect(deliveryMethodInputElms.count()).toBe(1);

        var deliveryMethodMailElms = deliveryMethodInputElms
          .all(by.tagName("option"))
          .filter(_.bind(elmHasTextPredicate, null, _, "I will mail a check"));

        expect(deliveryMethodMailElms.count()).toBe(1);
        deliveryMethodMailElms.get(0).click();
      }

      function clickSubmitButton() {
        var submitBtnElms = element.all(by.css("div.modal-dialog div.modal-footer button"))
          .filter(_.bind(elmHasTextPredicate, null, _, "SUBMIT"));

        expect(submitBtnElms.count()).toBe(1);
        submitBtnElms.get(0).click();

        // Wait for the confirmation text to appear to continue
        var confirmationElms = element.all(by.css("div.modal-body p.form-title"))
          .filter(elmIsDisplayedPredicate)
          .filter(_.bind(elmHasTextPredicate, null, _, "Gift Confirmation"));

        expect(confirmationElms.count()).toBe(1);
      }

      function retrieveAndVerifyNewPurchase() {
        var isRetrievePurchaseDone = false;

        var promiseToRetrieve = new Promise(function(resolve, reject) {
            unirest.get('http://localhost:8080/wedding-test-ws/purchases?purchasedByEmail=' + PURCHASED_BY_EMAIL)
              .end(function(response) {
                console.log("Retrieved purchase: " + JSON.stringify(response.body));

                expect(response.ok).toBe(true);
                expect(response.body.length).toBe(1);

                var newPurchase = response.body[0];
                expect(newPurchase.customDescription).toBe(REG_ITEM_DESCRIPTION);
                expect(newPurchase.price).toBe(100);
                expect(newPurchase.deliveryMethod).toBe("mail");
                expect(newPurchase.purchasedByNames).toBe(PURCHASED_BY_NAMES);
                expect(newPurchase.purchasedByEmail).toBe(PURCHASED_BY_EMAIL);

                resolve();
              });
          }
        );

        promiseToRetrieve.then(function() {
          isRetrievePurchaseDone = true;
        });

        browser.wait(function() {
          return isRetrievePurchaseDone;
        }, REST_OP_TIMEOUT_MS);
      }


      /** Util **/

      function logHtml(elm) {
        elm.getOuterHtml().then(function(html) {
          console.log(html);
        });
      }

      function elmIsDisplayedPredicate(elm) {
        return elm.isDisplayed().then(function(isDisplayed) {
          return isDisplayed === true;
        });
      }

      function elmHasTextPredicate(elm, compareText) {
        return elm.getText().then(function(text) {
          return text === compareText;
        });
      }
    });

    afterAll(function() {
      /** Cleanup **/
      browser.controlFlow().execute(deletePurchase);
      browser.controlFlow().execute(deleteRegItem);

      function deletePurchase() {
        var isDeleteDone = false;

        // Delete the Registry Item added for this test
        var promiseToDelete = new Promise(function(resolve, reject) {
            unirest.delete('http://localhost:8080/wedding-test-ws/purchases')
              .type('json')
              .send({ purchasedByEmail: PURCHASED_BY_EMAIL })
              .end(function(response) {
                expect(response.ok).toBe(true);
                resolve();
              });
          }
        );

        promiseToDelete.then(function() {
          isDeleteDone = true;
        });

        browser.wait(function() {
          return isDeleteDone;
        }, REST_OP_TIMEOUT_MS);
      }

      function deleteRegItem() {
        var isDeleteDone = false;

        // Delete the Registry Item added for this test
        var promiseToDelete = new Promise(function(resolve, reject) {
            unirest.delete('http://localhost:8080/wedding-test-ws/registryItems')
              .type('json')
              .send({ description: REG_ITEM_DESCRIPTION })
              .end(function(response) {
                expect(response.ok).toBe(true);
                resolve();
              });
          }
        );

        promiseToDelete.then(function() {
          isDeleteDone = true;
        });

        browser.wait(function() {
          return isDeleteDone;
        }, REST_OP_TIMEOUT_MS);
      }

    });

  });

});
