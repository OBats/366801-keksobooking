'use strict';

(function () {
  var pinMapBlock = document.querySelector('.tokyo__pin-map');
  var dialogClose = document.querySelector('.dialog__close');


  function renderPinMapElements(pinElements) {
    var fragment = document.createDocumentFragment();
    var count = pinElements.length;

    for (var i = 0; i < count; i++) {
      var pinData = pinElements[i];
      var pinElement = window.pin.getPinMapElement(pinData);
      fragment.appendChild(pinElement);

      if (i === 0) {
        window.pin.selectPin(pinElement);
        window.pin.openDialog(pinData);
      }
    }
    pinMapBlock.appendChild(fragment);
  }

  window.map = {
    timeIn: document.querySelector('#timein'),
    timeOut: document.querySelector('#timeout'),
    housingType: document.querySelector('#type'),
    roomsNumber: document.querySelector('#room_number'),
    offerDialog: document.querySelector('#offer-dialog'),
    renderDialogElement: function (offer) {
      var dialogPanel = this.offerDialog.querySelector('.dialog__panel');

      this.offerDialog.querySelector('.dialog__title > img').src = offer.author.avatar;

      this.offerDialog.replaceChild(window.card.getDialogElement(offer), dialogPanel);
    }
  };

  dialogClose.addEventListener('click', window.pin.onCloseDialog);
  pinMapBlock.addEventListener('keydown', window.pin.onPinEnterPress);
  document.addEventListener('keydown', window.pin.onDialogEscPress);

  window.map.timeIn.addEventListener('change', window.form.syncTimeIn);
  window.map.housingType.addEventListener('change', window.form.syncTypeWithPrice);
  window.map.roomsNumber.addEventListener('change', window.form.syncRoomsWithCapacity);

  var offers = window.data.getOffers(8);
  renderPinMapElements(offers);
})();
