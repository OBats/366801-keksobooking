'use strict';

(function () {
  var timeInElement = document.querySelector('#timein');
  var timeOutElement = document.querySelector('#timeout');
  var housingTypeElement = document.querySelector('#type');
  var roomsNumberElement = document.querySelector('#room_number');

  function syncTimeIn() {
    if (timeInElement.value !== timeOutElement.value) {
      timeOutElement.value = timeInElement.value;
    }
  }

  function syncTypeWithPrice() {
    var nightPrice = document.querySelector('#price');

    switch (housingTypeElement.value) {
      case 'flat':
        nightPrice.min = '1000';
        break;
      case 'house':
        nightPrice.min = '5000';
        break;
      case 'palace':
        nightPrice.min = '10000';
        break;
      default:
        nightPrice.min = '0';
        break;
    }
    nightPrice.value = nightPrice.value || nightPrice.min;
  }

  function syncRoomsWithCapacity() {
    var capacity = document.querySelector('#capacity');
    var capacityChildrens = capacity.children;
    var roomsNumberValue = parseInt(roomsNumberElement.value, 10);

    for (var i = 0; i < capacityChildrens.length; i++) {
      var capacityOption = capacityChildrens[i];
      var capacityOptionValue = parseInt(capacityOption.value, 10);
      capacityOption.removeAttribute('selected');

      var isDisabled = false;
      var isSelected = false;
      if (roomsNumberValue < 100) {
        isDisabled = capacityOptionValue > roomsNumberValue || capacityOptionValue === 0;
        isSelected = capacityOptionValue === roomsNumberValue;
      } else {
        isDisabled = capacityOptionValue !== 0;
        isSelected = !isDisabled;
      }

      if (isDisabled) {
        capacityOption.setAttribute('disabled', '');
      } else {
        capacityOption.removeAttribute('disabled');
      }

      if (isSelected) {
        capacityOption.setAttribute('selected', '');
      }
    }
  }

  timeInElement.addEventListener('change', syncTimeIn);
  housingTypeElement.addEventListener('change', syncTypeWithPrice);
  roomsNumberElement.addEventListener('change', syncRoomsWithCapacity);
})();
