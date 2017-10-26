'use strict';

(function () {
  var avatarChooser = document.querySelector('.notice__photo input[type=file]');
  var avatarPreview = document.querySelector('.notice__preview img');

  var photoContainer = document.querySelector('.form__photo-container');
  var photos = [].slice.call(photoContainer.querySelectorAll('.form__photo'));
  var photoChooser = photoContainer.querySelector('input[type=file]');

  function isImage(file) {
    return /\.(gif|jpe?g|png|svg)$/i.test(file.name);
  }

  function isEmpty(node) {
    return !node.hasChildNodes();
  }

  function loadAndSetPhotos(container, file) {
    var reader = new FileReader();
    var img = document.createElement('img');

    reader.addEventListener('load', function () {
      img.src = reader.result;
      container.appendChild(img);
    });

    reader.readAsDataURL(file);
  }

  function onPhotoChooserChange() {
    var imageFiles = [].filter.call(photoChooser.files, isImage);

    photos
        .filter(isEmpty)
        .forEach(function (photo, i) {
          var file = imageFiles[i];
          if (file) {
            loadAndSetPhotos(photo, file);
          }
        });
  }

  function onAvatarChooserChange() {
    var file = avatarChooser.files[0];

    if (isImage(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  avatarChooser.addEventListener('change', onAvatarChooserChange);
  photoChooser.addEventListener('change', onPhotoChooserChange);
})();
