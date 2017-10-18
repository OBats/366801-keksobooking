'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

  var avatarChooser = document.querySelector('.notice__photo input[type=file]');
  var avatarPreview = document.querySelector('.notice__preview img');

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    var isPicture = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (isPicture) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
