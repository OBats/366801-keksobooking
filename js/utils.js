'use strict';

(function () {
  window.utils = {
    KEY_CODES: {
      ESC: 27,
      ENTER: 13
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
