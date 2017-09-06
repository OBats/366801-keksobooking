'use strict';

(function () {
  var mapEdgesParams = {
    mapMarginBottom: 40,
    mapStartEdge: 0,
    mapLeftEdge: 1200 - window.utils.PIN_MAIN_SIZE.x,
    mapBottomEdge: 700 - window.utils.PIN_MAIN_SIZE.y - 40
  };

  var pinMapBlockElement = document.querySelector('.tokyo__pin-map');
  var pinMapMainElement = pinMapBlockElement.querySelector('.pin__main');
  var dialogCloseElement = document.querySelector('.dialog__close');
  var offerDialogElement = document.querySelector('#offer-dialog');

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
    pinMapBlockElement.appendChild(fragment);
  }

  function closeDialog() {
    offerDialogElement.classList.add('hidden');
  }

  function onDialogEscPress(event) {
    if (event.keyCode === window.utils.KEY_CODES.ESC && window.pin.hasSelectedPin()) {
      window.map.onCloseDialog();
    }
  }

  function onPinMapMainElementMousedown(event) {
    event.preventDefault();

    var startCoords = {
      x: event.clientX,
      y: event.clientY
    };

    function onMouseMove(moveEvent) {
      moveEvent.preventDefault();

      var shift = {
        x: startCoords.x - moveEvent.clientX,
        y: startCoords.y - moveEvent.clientY
      };

      startCoords = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };

      var currentCoords = {
        x: pinMapMainElement.offsetLeft - shift.x,
        y: pinMapMainElement.offsetTop - shift.y
      };

      if (mapEdgesParams.mapStartEdge < currentCoords.x && currentCoords.x < mapEdgesParams.mapLeftEdge) {
        pinMapMainElement.style.left = currentCoords.x + 'px';
      }

      if (mapEdgesParams.mapStartEdge < currentCoords.y && currentCoords.y < mapEdgesParams.mapBottomEdge) {
        pinMapMainElement.style.top = currentCoords.y + 'px';
      }

      pinMapMainElement.style.zIndex = '1';

      window.form.setAddress(currentCoords);
    }

    function onMouseUp(upEvent) {
      upEvent.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.map = {
    renderDialogElement: function (offer) {
      var dialogPanel = offerDialogElement.querySelector('.dialog__panel');

      offerDialogElement.querySelector('.dialog__title > img').src = offer.author.avatar;

      offerDialogElement.replaceChild(window.card.getDialogElement(offer), dialogPanel);
    },

    openDialog: function (offer) {
      window.map.renderDialogElement(offer);
      offerDialogElement.classList.remove('hidden');
    },

    onCloseDialog: function () {
      closeDialog();
      window.pin.clearSelectedPin();
    }
  };

  var offers = window.data.getOffers(8);
  renderPinMapElements(offers);

  pinMapMainElement.addEventListener('mousedown', onPinMapMainElementMousedown);
  dialogCloseElement.addEventListener('click', window.map.onCloseDialog);
  pinMapBlockElement.addEventListener('keydown', window.pin.onPinEnterPress);
  document.addEventListener('keydown', onDialogEscPress);
})();
