'use strict';

(function () {
  var dragEl = null;
  var dragContainer = document.querySelectorAll('.form__photo');

  function onDragStart(event) {
    dragEl = event.target;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', dragEl.src);

    dragEl.parentNode.classList.add('moving');
  }

  function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function onDragEnter(event) {
    event.target.classList.add('over');
  }

  function onDragLeave(event) {
    event.target.classList.remove('over');
  }

  function onDragDrop(event) {
    var target = event.target;

    if (target && target !== dragEl) {
      dragEl.src = target.src;
      target.src = event.dataTransfer.getData('text');
    }
  }

  function onDragEnd() {
    [].forEach.call(dragContainer, function (el) {
      if (el.childNodes[0].classList.contains('over')) {
        el.childNodes[0].classList.remove('over');
      }
      el.classList.remove('moving');
    });
  }

  window.dragHandler = function () {
    [].forEach.call(dragContainer, function (el) {
      if (el.hasChildNodes()) {
        el.setAttribute('draggable', true);

        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('dragover', onDragOver);
        el.addEventListener('dragenter', onDragEnter);
        el.addEventListener('dragleave', onDragLeave);
        el.addEventListener('drop', onDragDrop);
        el.addEventListener('dragend', onDragEnd);
      }
    });
  };
})();
