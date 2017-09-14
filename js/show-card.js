'use strict';

(function () {
  window.showCard = function (offer, targetElement) {
    var dialogPanelElement = targetElement.querySelector('.dialog__panel');

    targetElement.querySelector('.dialog__title > img').src = offer.author.avatar;

    targetElement.replaceChild(window.card.createCard(offer), dialogPanelElement);
  };
})();
