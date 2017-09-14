'use strict';

(function () {
  window.utils = {
    KEY_CODES: {
      ESC: 27,
      ENTER: 13
    },

    showOverlayMsg: function (bgColor, msgText) {
      var msgElement = document.createElement('div');
      msgElement.style.position = 'fixed';
      msgElement.style.left = 0;
      msgElement.style.right = 0;
      msgElement.style.zIndex = '200';
      msgElement.style.margin = '0 auto';
      msgElement.style.fontSize = '25px';
      msgElement.style.color = '#fff';
      msgElement.style.textAlign = 'center';
      msgElement.style.backgroundColor = bgColor;

      msgElement.textContent = msgText;
      document.body.insertAdjacentElement('afterbegin', msgElement);

      setTimeout(function () {
        msgElement.remove();
      }, 5000);
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
    },

    matchByValue: function (target, value) {
      return value === target;
    },

    matchEqualOrMore: function (target, value) {
      return value >= target;
    },

    getAnyOrMatch: function (value, matchFn) {
      return value === 'any' ? true : matchFn(value);
    },

    checkInclusion: function (items, requiredItems) {
      if (requiredItems.length !== 0) {
        for (var i = 0; i < requiredItems.length; i++) {
          var requiredItem = requiredItems[i];
          if (items.indexOf(requiredItem) === -1) {
            return false;
          }
        }
      }
      return true;
    },

    filterByMultiple: function (items, filters) {
      return items.filter(function (item, id) {
        for (var i = 0; i < filters.length; i++) {
          var filterFn = filters[i];
          if (!filterFn(item, id, items)) {
            return false;
          }
        }
        return true;
      });
    },

    debounce: function (fn, debouncePeriod) {
      var current = null;
      return function () {
        if (current) {
          return;
        }

        var args = arguments;

        current = setTimeout(function () {
          fn.apply(null, args);
          clearTimeout(current);
          current = null;
        }, debouncePeriod);
      };
    }
  };
})();
