'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/keksobooking';

  function setupServer(onLoad, onError) {
    var SUCCESS_STATUS = 200;
    var xhrTimeout = 10000;

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
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

    xhr.timeout = xhrTimeout;

    return xhr;
  }

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setupServer(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = setupServer(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };
})();
