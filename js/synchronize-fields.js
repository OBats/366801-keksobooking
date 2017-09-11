'use strict';

(function () {
  var timeInElement = document.querySelector('#timein');
  var timeOutElement = document.querySelector('#timeout');
  var housingTypeElement = document.querySelector('#type');
  var roomsNumberElement = document.querySelector('#room_number');
  var guestsNumberElement = document.querySelector('#capacity');

  function synchronizeFields(syncSource, syncTarget, sourceOptions, targetOptions, syncFn) {
    function sync() {
      var selectedValue = syncSource.value;
      var selectedOptionIdx = sourceOptions.indexOf(selectedValue);
      if (selectedOptionIdx > -1 && targetOptions.length - 1 >= selectedOptionIdx) {
        var targetValue = targetOptions[selectedOptionIdx];
        syncFn(syncTarget, targetValue);
      }
    }

    syncSource.addEventListener('change', sync);

    return function () {
      syncSource.removeEventListener('change', sync);
    };
  }

  function syncValues(element, value) {
    element.value = value;
  }

  function syncRoomsWithCapacity(element, enabledOptions) {
    var options = [].slice.call(element.querySelectorAll('option'));
    options.forEach(function (option) {
      var optionValueIdx = enabledOptions.indexOf(option.value);
      if (optionValueIdx > -1) {
        option.disabled = false;
        if (optionValueIdx === 0) {
          option.selected = true;
        }
      } else {
        option.disabled = true;
      }
    });
  }

  function syncTypeWithPrice() {
    var pricePerNight = document.querySelector('#price');

    switch (housingTypeElement.value) {
      case 'flat':
        pricePerNight.min = '1000';
        break;
      case 'house':
        pricePerNight.min = '5000';
        break;
      case 'palace':
        pricePerNight.min = '10000';
        break;
      default:
        pricePerNight.min = '0';
        break;
    }
    pricePerNight.value = pricePerNight.value || pricePerNight.min;
  }

  housingTypeElement.addEventListener('change', syncTypeWithPrice);

  synchronizeFields(
      timeInElement,
      timeOutElement,
      ['12:00', '13:00', '14:00'],
      ['12:00', '13:00', '14:00'],
      syncValues
  );

  synchronizeFields(
      timeInElement,
      timeOutElement,
      ['12:00', '13:00', '14:00'],
      ['12:00', '13:00', '14:00'],
      syncValues
  );

  synchronizeFields(
      roomsNumberElement,
      guestsNumberElement,
      ['1', '2', '3', '100'],
      [['1'], ['2', '1'], ['3', '2', '1'], ['0']],
      syncRoomsWithCapacity
  );
})();
