'use strict';

(function () {
  window.utils = {
    KEY_CODES: {
      ESC: 27,
      ENTER: 13
    },

    overlayMsgParams: {
      bgColorGreen: 'green',
      bgColorRed: 'red',
      msgOnSuccess: 'Все ОК. Данные отправлены!',
      msgOnErrorForm: 'Ошибка! Кажется, Вы что-то не то ввели.',
      msgOnErrorConnection: 'Произошла ошибка соединения'
    },

    showOverlayMsg: function (bgColor, msgText, resetForm) {
      var msgElement = document.createElement('div');
      msgElement.style.position = 'fixed';
      msgElement.style.left = 0;
      msgElement.style.right = 0;
      msgElement.style.zIndex = '100';
      msgElement.style.margin = '0 auto';
      msgElement.style.fontSize = '25px';
      msgElement.style.color = '#fff';
      msgElement.style.textAlign = 'center';
      msgElement.style.backgroundColor = bgColor;

      msgElement.textContent = msgText;
      document.body.insertAdjacentElement('afterbegin', msgElement);

      if (resetForm) {
        setTimeout(function () {
          msgElement.remove();
        }, 3000);

        resetForm();
      }
    },

    createRandomArrayItemGetter: function (array) {
      var randomSource = array.slice();

      return function () {
        var randomNumber;
        if (randomSource.length === 1) {
          randomNumber = randomSource[0];
          randomSource = array.slice();
        } else {
          var randomId = Math.floor(Math.random() * randomSource.length);
          randomNumber = randomSource[randomId];
          randomSource.splice(randomId, 1);
        }
        return randomNumber;
      };
    },

    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomArrayLength: function (array) {
      var randomLength = array.length - Math.floor(Math.random() * array.length);
      return array.slice(0, randomLength);
    }
  };
})();
