'use strict';

(function () {
  var MAP_TOP_MARGIN = 70;
  var MAP_BOTTOM_MARGIN = 40;

  var isDragging = false;
  var startCoordsX;
  var startCoordsY;
  var pinMapMainElementWidth;
  var pinMapMainElementHeight;
  var mapMinX;
  var mapMaxX;
  var mapMinY;
  var mapMaxY;

  var tokyoMapAreaElement = document.querySelector('.tokyo > img');
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

    isDragging = true;
    startCoordsX = event.clientX;
    startCoordsY = event.clientY;

    pinMapMainElementWidth = pinMapMainElement.offsetWidth;
    pinMapMainElementHeight = pinMapMainElement.offsetHeight;
    mapMinX = tokyoMapAreaElement.offsetLeft;
    mapMaxX = tokyoMapAreaElement.offsetWidth - pinMapMainElementWidth;
    mapMinY = tokyoMapAreaElement.offsetTop + MAP_TOP_MARGIN;
    mapMaxY = tokyoMapAreaElement.offsetHeight - pinMapMainElementHeight - MAP_BOTTOM_MARGIN;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseMove(event) {
    event.preventDefault();

    if (isDragging) {

      var currentCoords = {
        x: event.clientX,
        y: event.clientY
      };

      var shift = {
        x: currentCoords.x - startCoordsX,
        y: currentCoords.y - startCoordsY
      };

      var newCoords = {
        x: pinMapMainElement.offsetLeft + shift.x,
        y: pinMapMainElement.offsetTop + shift.y
      };

      if (newCoords.x > mapMaxX) {
        newCoords.x = mapMaxX;
      } else if (newCoords.x < mapMinX) {
        newCoords.x = mapMinX;
      }

      if (newCoords.y > mapMaxY) {
        newCoords.y = mapMaxY;
      } else if (newCoords.y < mapMinY) {
        newCoords.y = mapMinY;
      }

      pinMapMainElement.style.left = newCoords.x + 'px';
      pinMapMainElement.style.top = newCoords.y + 'px';
      pinMapMainElement.style.zIndex = '1';

      startCoordsX = currentCoords.x;
      startCoordsY = currentCoords.y;

      var addressCoords = {
        x: newCoords.x + pinMapMainElement.offsetWidth / 2,
        y: newCoords.y + pinMapMainElement.offsetHeight
      };

      window.form.setAddress(addressCoords);
    }
  }

  window.map = {
    openDialog: function (offer) {
      window.showCard(offer, offerDialogElement);
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
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
  dialogCloseElement.addEventListener('click', window.map.onCloseDialog);
  pinMapBlockElement.addEventListener('keydown', window.pin.onPinEnterPress);
  document.addEventListener('keydown', onDialogEscPress);
})();
