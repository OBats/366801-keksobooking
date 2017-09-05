'use strict';

(function () {

  window.form = {
    syncTimeIn: function () {
      var timeIn = window.map.timeIn;
      var timeOut = window.map.timeOut;

      if (timeIn.value !== timeOut.value) {
        timeOut.value = timeIn.value;
      }
    },

    syncTypeWithPrice: function () {
      var housingType = window.map.housingType;
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
    },

    syncRoomsWithCapacity: function () {
      var roomsNumber = window.map.roomsNumber;
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
  };
})();
