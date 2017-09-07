'use strict';

(function () {
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var housingType = document.querySelector('#type');
  var roomsNumber = document.querySelector('#room_number');
  var addressInputElement = document.querySelector('#address');

  function syncTimeIn() {
    if (timeIn.value !== timeOut.value) {
      timeOut.value = timeIn.value;
    }
  }

  function syncTypeWithPrice() {
    var nightPrice = document.querySelector('#price');

    switch (housingType.value) {
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
    var roomsNumberValue = parseInt(roomsNumber.value, 10);

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

  window.form = {
    setAddress: function (coords) {
      addressInputElement.value = 'x: ' + coords.x +
      ', ' + 'y: ' + coords.y;
    }
  };

  timeIn.addEventListener('change', syncTimeIn);
  housingType.addEventListener('change', syncTypeWithPrice);
  roomsNumber.addEventListener('change', syncRoomsWithCapacity);
})();
