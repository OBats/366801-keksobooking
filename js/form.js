'use strict';

(function () {
  window.form = {
    setAddress: function (coords) {
      var addressInputElement = document.querySelector('#address');
      addressInputElement.value = 'x: ' + coords.x +
      ', ' + 'y: ' + coords.y;
    }
  };
})();
