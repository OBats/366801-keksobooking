'use strict';

(function () {

  var focusedPinElement;
  var focusedPinContent;
  var selectedPin;
  var pinElementsDestructors = [];

  function setFocusedPin(pinElement, pinData) {
    focusedPinElement = pinElement;
    focusedPinContent = pinData;
  }

  function clearSelectedPin() {
    if (selectedPin) {
      selectedPin.classList.remove('pin--active');
      selectedPin = null;
    }
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
      var PIN_HALF_WIDTH = 28;
      var PIN_HEIGHT = 75;
      var PIN_MAP_IMAGE_SIZE = 40;

      var pinMapElement = document.createElement('div');
      var pinMapImageElement = document.createElement('img');
      var pinClickHandler = onPinClick.bind(null, pinMapElement, pinParams);
      var pinFocusHandler = onPinFocus.bind(null, pinMapElement, pinParams);

      var pinMapImageCoordinates = {
        x: pinParams.location.x - PIN_HALF_WIDTH + 'px',
        y: pinParams.location.y - PIN_HEIGHT + 'px'
      };

      pinMapElement.classList.add('pin');
      pinMapElement.style.left = pinMapImageCoordinates.x;
      pinMapElement.style.top = pinMapImageCoordinates.y;

      pinMapImageElement.src = pinParams.author.avatar;
      pinMapImageElement.classList.add('rounded');
      pinMapImageElement.setAttribute('width', PIN_MAP_IMAGE_SIZE);
      pinMapImageElement.setAttribute('height', PIN_MAP_IMAGE_SIZE);
      pinMapImageElement.setAttribute('tabindex', 0);
      pinMapImageElement.addEventListener('focus', pinFocusHandler);
      pinMapImageElement.addEventListener('blur', onPinLoseFocus);

      pinMapElement.appendChild(pinMapImageElement);
      pinMapElement.addEventListener('click', pinClickHandler);

      pinElementsDestructors.push(function () {
        pinMapImageElement.removeEventListener('focus', pinFocusHandler);
        pinMapImageElement.removeEventListener('blur', onPinLoseFocus);
        pinMapElement.removeEventListener('click', pinClickHandler);
        pinMapElement.remove();
      });

      return pinMapElement;
    },

    selectPin: function (pinElement) {
      clearSelectedPin(selectedPin);
      selectedPin = pinElement;
      selectedPin.classList.add('pin--active');
    },

    hasSelectedPin: function () {
      return !!selectedPin;
    },

    clearSelectedPin: clearSelectedPin,

    onPinEnterPress: function (event) {
      if (event.keyCode === window.utils.KEY_CODES.ENTER && focusedPinElement) {
        onPinClick(focusedPinElement, focusedPinContent);
      }
    },

    removePins: function () {
      clearSelectedPin();
      clearFocusedPin();
      while (pinElementsDestructors.length > 0) {
        var destructor = pinElementsDestructors.pop();
        destructor();
      }
    }
  };
})();
