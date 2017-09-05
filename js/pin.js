'use strict';

(function () {
  var KEY_CODES = {
    ESC: 27,
    ENTER: 13
  };

  var focusedPinElement;
  var focusedPinContent;
  var selectedPin;

  function setFocusedPin(pinElement, pinData) {
    focusedPinElement = pinElement;
    focusedPinContent = pinData;
  }

  function clearFocusedPin() {
    focusedPinElement = null;
    focusedPinContent = null;
  }

  function clearSelectedPin() {
    if (selectedPin) {
      selectedPin.classList.remove('pin--active');
      selectedPin = null;
    }
  }

  function onPinFocus(pinElement, pinData) {
    setFocusedPin(pinElement, pinData);
  }

  function onPinLoseFocus() {
    clearFocusedPin();
  }

  function onPinClick(pinElement, pinData) {
    window.pin.selectPin(pinElement);
    window.pin.openDialog(pinData);
  }

  function closeDialog() {
    window.map.offerDialog.classList.add('hidden');
  }

  window.pin = {
    getPinMapElement: function (pinParams) {
      var pinMapElement = document.createElement('div');
      var pinMapImage = document.createElement('img');

      var pinMapImageCoordinates = {
        x: pinParams.location.x + (56 * 0.5) + 'px',
        y: pinParams.location.y + 75 + 'px'
      };

      pinMapElement.classList.add('pin');
      pinMapElement.style.left = pinMapImageCoordinates.x;
      pinMapElement.style.top = pinMapImageCoordinates.y;

      pinMapImage.src = pinParams.author.avatar;
      pinMapImage.classList.add('rounded');
      pinMapImage.setAttribute('width', 40);
      pinMapImage.setAttribute('height', 40);
      pinMapImage.setAttribute('tabindex', 0);
      pinMapImage.addEventListener('focus', onPinFocus.bind(null, pinMapElement, pinParams));
      pinMapImage.addEventListener('blur', onPinLoseFocus);

      pinMapElement.appendChild(pinMapImage);
      pinMapElement.addEventListener('click', onPinClick.bind(null, pinMapElement, pinParams));

      return pinMapElement;
    },

    selectPin: function (pinElement) {
      clearSelectedPin(selectedPin);
      selectedPin = pinElement;
      selectedPin.classList.add('pin--active');
    },

    openDialog: function (offer) {
      window.map.renderDialogElement(offer);
      window.map.offerDialog.classList.remove('hidden');
    },

    onCloseDialog: function () {
      closeDialog();
      clearSelectedPin();
    },

    onDialogEscPress: function (event) {
      if (event.keyCode === KEY_CODES.ESC && selectedPin) {
        window.pin.onCloseDialog();
      }
    },

    onPinEnterPress: function (event) {
      if (event.keyCode === KEY_CODES.ENTER && focusedPinElement) {
        onPinClick(focusedPinElement, focusedPinContent);
      }
    }
  };
})();
