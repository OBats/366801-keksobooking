'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  function serverSetup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Что-то пошло не так. Попробуйте еще раз');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      var msgText = 'Запрос не успел выполниться за ' + xhr.timeout + 'мс';

      onError(msgText);
    });

    xhr.timeout = 10000;

    return xhr;
  }

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = serverSetup(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = serverSetup(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };
})();
