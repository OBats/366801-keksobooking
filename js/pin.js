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
      var pinMapElement = document.createElement('div');
      var pinMapImageElement = document.createElement('img');
      var pinClickHandler = onPinClick.bind(null, pinMapElement, pinParams);
      var pinFocusHandler = onPinFocus.bind(null, pinMapElement, pinParams);

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
      this.clearSelectedPin(selectedPin);
      selectedPin = pinElement;
      selectedPin.classList.add('pin--active');
    },

    hasSelectedPin: function () {
      return selectedPin ? true : false;
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
        var destructor = pinElementsDestructors.shift();
        destructor();
      }
    }
  };
})();
