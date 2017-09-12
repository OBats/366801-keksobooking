'use strict';

(function () {
  var formElement = document.querySelector('.notice__form');
  var timeInElement = formElement.querySelector('#timein');
  var timeOutElement = formElement.querySelector('#timeout');
  var housingTypeElement = formElement.querySelector('#type');
  var roomsNumberElement = formElement.querySelector('#room_number');
  var guestsNumberElement = formElement.querySelector('#capacity');
  var pricePerNightElement = formElement.querySelector('#price');

  function syncOptionsValues(element, value) {
    element.value = value;
  }

  function syncMinValue(element, value) {
    element.min = value;
  }

  function syncRoomsWithGuests(element, enabledOptions) {
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

  formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    window.backend.save(
        new FormData(formElement),
        window.utils.showOverlayMsg,
        window.utils.showOverlayMsg
    );
  });

  window.synchronizeFields(
      timeInElement,
      timeOutElement,
      ['12:00', '13:00', '14:00'],
      ['12:00', '13:00', '14:00'],
      syncOptionsValues
  );

  window.synchronizeFields(
      timeOutElement,
      timeInElement,
      ['12:00', '13:00', '14:00'],
      ['12:00', '13:00', '14:00'],
      syncOptionsValues
  );

  window.synchronizeFields(
      housingTypeElement,
      pricePerNightElement,
      ['flat', 'house', 'palace', 'bungalo'],
      ['1000', '5000', '10000', '0'],
      syncMinValue
  );

  window.synchronizeFields(
      roomsNumberElement,
      guestsNumberElement,
      ['1', '2', '3', '100'],
      [['1'], ['2', '1'], ['3', '2', '1'], ['0']],
      syncRoomsWithGuests
  );

  window.form = {
    setAddress: function (coords) {
      var addressInputElement = document.querySelector('#address');
      addressInputElement.value = 'x: ' + coords.x +
      ', ' + 'y: ' + coords.y;
    },

    resetForm: function () {
      formElement.reset();
    }
  };
})();
