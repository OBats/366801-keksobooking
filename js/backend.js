'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  function serverSetup(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        if (xhr.responseURL === SERVER_URL) {
          onLoad(
              window.utils.overlayMsgParams.bgColorGreen,
              window.utils.overlayMsgParams.msgOnSuccess,
              window.form.resetForm
          );
        } else {
          onLoad(xhr.response);
        }
      } else {
        onError(
            window.utils.overlayMsgParams.bgColorRed,
            window.utils.overlayMsgParams.msgOnErrorForm
        );
      }
    });

    xhr.addEventListener('error', function () {
      onError(
          window.utils.overlayMsgParams.bgColorRed,
          window.utils.overlayMsgParams.msgOnErrorConnection
      );
    });

    xhr.addEventListener('timeout', function () {
      var msgText = 'Запрос не успел выполниться за ' + xhr.timeout + 'мс';
      onError(window.utils.overlayMsgParams.bgColorRed, msgText);
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
