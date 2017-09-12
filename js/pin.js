'use strict';

(function () {

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

  function onPinFocus(pinElement, pinData) {
    setFocusedPin(pinElement, pinData);
  }

  function onPinLoseFocus() {
    clearFocusedPin();
  }

  function onPinClick(pinElement, pinData) {
    window.pin.selectPin(pinElement);
    window.map.openDialog(pinData);
  }

  window.pin = {
    getPinMapElement: function (pinParams) {
      var pinMapElement = document.createElement('div');
      var pinMapImageElement = document.createElement('img');

      var pinMapImageCoordinates = {
        x: pinParams.location.x - (56 * 0.5) + 'px',
        y: pinParams.location.y - 75 + 'px'
      };

      pinMapElement.classList.add('pin');
      pinMapElement.style.left = pinMapImageCoordinates.x;
      pinMapElement.style.top = pinMapImageCoordinates.y;

      pinMapImageElement.src = pinParams.author.avatar;
      pinMapImageElement.classList.add('rounded');
      pinMapImageElement.setAttribute('width', 40);
      pinMapImageElement.setAttribute('height', 40);
      pinMapImageElement.setAttribute('tabindex', 0);
      pinMapImageElement.addEventListener('focus', onPinFocus.bind(null, pinMapElement, pinParams));
      pinMapImageElement.addEventListener('blur', onPinLoseFocus);

      pinMapElement.appendChild(pinMapImageElement);
      pinMapElement.addEventListener('click', onPinClick.bind(null, pinMapElement, pinParams));

      return pinMapElement;
    },

    selectPin: function (pinElement) {
      this.clearSelectedPin(selectedPin);
      selectedPin = pinElement;
      selectedPin.classList.add('pin--active');
    },

    hasSelectedPin: function () {
      return selectedPin ? true : false;
    },

    clearSelectedPin: function () {
      if (selectedPin) {
        selectedPin.classList.remove('pin--active');
        selectedPin = null;
      }
    },

    onPinEnterPress: function (event) {
      if (event.keyCode === window.utils.KEY_CODES.ENTER && focusedPinElement) {
        onPinClick(focusedPinElement, focusedPinContent);
      }
    }
  };
})();
