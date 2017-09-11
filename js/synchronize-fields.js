'use strict';

(function () {
  window.synchronizeFields = function (syncSource, syncTarget, sourceOptions, targetOptions, syncFn) {
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
  };
})();
