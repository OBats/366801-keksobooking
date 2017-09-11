'use strict';

(function () {
  window.showCard = {
    showCard: function (offer, target) {
      var dialogPanel = target.querySelector('.dialog__panel');

      target.querySelector('.dialog__title > img').src = offer.author.avatar;

      target.replaceChild(window.card.createCard(offer), dialogPanel);
    }
  };
})();
