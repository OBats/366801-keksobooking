'use strict';

(function () {
  var pinMapBlock = document.querySelector('.tokyo__pin-map');
  var dialogClose = document.querySelector('.dialog__close');
  var offerDialog = document.querySelector('#offer-dialog');

  function renderPinMapElements(pinElements) {
    var fragment = document.createDocumentFragment();
    var count = pinElements.length;

    for (var i = 0; i < count; i++) {
      var pinData = pinElements[i];
      var pinElement = window.pin.getPinMapElement(pinData);
      fragment.appendChild(pinElement);

      if (i === 0) {
        window.pin.selectPin(pinElement);
        window.map.openDialog(pinData);
      }
    }
    pinMapBlock.appendChild(fragment);
  }

  function closeDialog() {
    offerDialog.classList.add('hidden');
  }

  window.map = {
    renderDialogElement: function (offer) {
      var dialogPanel = offerDialog.querySelector('.dialog__panel');

      offerDialog.querySelector('.dialog__title > img').src = offer.author.avatar;

      offerDialog.replaceChild(window.card.getDialogElement(offer), dialogPanel);
    },

    openDialog: function (offer) {
      window.map.renderDialogElement(offer);
      offerDialog.classList.remove('hidden');
    },

    onCloseDialog: function () {
      closeDialog();
      window.pin.clearSelectedPin();
    }
  };

  var offers = window.data.getOffers(8);
  renderPinMapElements(offers);

  dialogClose.addEventListener('click', window.map.onCloseDialog);
  pinMapBlock.addEventListener('keydown', window.pin.onPinEnterPress);
  document.addEventListener('keydown', window.pin.onDialogEscPress);
})();
