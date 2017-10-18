'use strict';

(function () {
  var photoContainer = document.querySelector('.form__photo-container');
  var photos = [].slice.call(photoContainer.querySelectorAll('.form__photo'));
  var photoChooser = photoContainer.querySelector('input[type=file]');

  function isImage(file) {
    return /\.(gif|jpe?g|png|svg)$/i.test(file.name);
  }

  function isEmpty(node) {
    return !node.hasChildNodes();
  }

  function loadAndSetImage(container, file) {
    var reader = new FileReader();
    var img = document.createElement('img');

    reader.addEventListener('load', function (event) {
      img.src = event.target.result;
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
            loadAndSetImage(photo, file);
          }
        });
  }

  photoChooser.addEventListener('change', onPhotoChooserChange);
})();
