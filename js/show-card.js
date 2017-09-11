'use strict';

(function () {
  window.showCard = function (offer, targetElement) {
    var dialogPanel = targetElement.querySelector('.dialog__panel');

    targetElement.querySelector('.dialog__title > img').src = offer.author.avatar;

    targetElement.replaceChild(window.card.createCard(offer), dialogPanel);
  };
})();
