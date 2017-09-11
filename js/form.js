'use strict';

(function () {
  var formElement = document.querySelector('.notice__form');
  var timeInElement = document.querySelector('#timein');
  var timeOutElement = document.querySelector('#timeout');
  var housingTypeElement = document.querySelector('#type');
  var roomsNumberElement = document.querySelector('#room_number');
  var guestsNumberElement = document.querySelector('#capacity');
  var pricePerNightElement = document.querySelector('#price');

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

  function onSuccessSend() {
    var successMsgElement = document.createElement('div');
    successMsgElement.style.position = 'fixed';
    successMsgElement.style.left = 0;
    successMsgElement.style.right = 0;
    successMsgElement.style.zIndex = '100';
    successMsgElement.style.margin = '0 auto';
    successMsgElement.style.fontSize = '25px';
    successMsgElement.style.color = '#fff';
    successMsgElement.style.textAlign = 'center';
    successMsgElement.style.backgroundColor = 'green';

    successMsgElement.textContent = 'Все ОК. Данные отправлены!';
    document.body.insertAdjacentElement('afterbegin', successMsgElement);

    setTimeout(function () {
      successMsgElement.remove();
    }, 3000);

    formElement.reset();
  }

  formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    window.backend.save(new FormData(formElement), onSuccessSend, window.map.onErrorLoad);
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
    }
  };
})();
