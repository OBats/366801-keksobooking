'use strict';

(function () {
  var MAP_TOP_MARGIN = 70;
  var MAP_BOTTOM_MARGIN = 40;
  var FILTER_FIELDS = ['type', 'price', 'rooms', 'guests', 'features'];

  var currentFilters = {features: []};
  var offers = [];
  var isInitialLoad = true;
  var isDragging = false;
  var startCoordsX;
  var startCoordsY;
  var pinMapMainElementWidth;
  var pinMapMainElementHeight;
  var mapMinX;
  var mapMaxX;
  var mapMinY;
  var mapMaxY;

  var mapAreaElement = document.querySelector('.tokyo > img');
  var pinMapBlockElement = document.querySelector('.tokyo__pin-map');
  var pinMapMainElement = document.querySelector('.pin__main');
  var dialogCloseElement = document.querySelector('.dialog__close');
  var offerDialogElement = document.querySelector('#offer-dialog');

  var housingTypeFilterElement = document.querySelector('#housing_type');
  var housingPriceFilterElement = document.querySelector('#housing_price');
  var housingRoomNumberFilterElement = document.querySelector('#housing_room-number');
  var housingGuestsNumberFilterElement = document.querySelector('#housing_guests-number');
  var housingFeaturesContainer = document.querySelector('#housing_features');
  var housingFeaturesElements = [].slice.call(housingFeaturesContainer.querySelectorAll('input'));

  function filterPrice(selectedPriceOption, offerPrice) {
    var MAX_PRICE = 50000;
    var MIN_PRICE = 10000;

    switch (selectedPriceOption) {
      case 'high':
        return offerPrice > MAX_PRICE;
      case 'middle':
        return offerPrice >= MIN_PRICE && offerPrice <= MAX_PRICE;
      case 'low':
        return offerPrice < MIN_PRICE;
      default:
        return true;
    }
  }

  function checkRequiredFeatures(requiredFeatures, offerFeatures) {
    return window.utils.checkInclusion(offerFeatures, requiredFeatures);
  }

  var filterFunctionsByField = {
    type: window.utils.matchByValue,
    price: filterPrice,
    rooms: window.utils.matchEqualOrMore,
    guests: window.utils.matchEqualOrMore,
    features: checkRequiredFeatures
  };

  function getFilteredOffers() {
    var filteredOffers = offers.filter(function (offer) {
      for (var i = 0; i < FILTER_FIELDS.length; i++) {
        var filterField = FILTER_FIELDS[i];
        var filterFunction = filterFunctionsByField[filterField];
        var filterValue = currentFilters[filterField] || 'any';
        var offerValue = offer.offer[filterField];
        if (filterValue === 'any') {
          continue;
        }
        if (!filterFunction(filterValue, offerValue)) {
          return false;
        }
      }
      return true;
    });

    if (isInitialLoad) {
      isInitialLoad = false;
      return filteredOffers.slice(0, 3);
    }

    return filteredOffers;
  }

  var debouncedRender = window.utils.debounce(renderPinMapElements, 500);

  function setFilter(filterField, filterValue) {
    currentFilters[filterField] = filterValue;
    debouncedRender();
  }

  function onHousingTypeFilterChange() {
    setFilter('type', housingTypeFilterElement.value);
  }

  function onHousingPriceFilterChange() {
    setFilter('price', housingPriceFilterElement.value);
  }

  function onHousingRoomNumberFilterChange() {
    setFilter('rooms', parseInt(housingRoomNumberFilterElement.value, 10));
  }

  function onHousingGuestsNumberFilterChange() {
    setFilter('guests', parseInt(housingGuestsNumberFilterElement.value, 10));
  }

  function setRequiredFeaturesFilter() {
    var requiredFeatures = housingFeaturesElements
        .filter(function (featureElement) {
          return featureElement.checked;
        })
        .map(function (featureElement) {
          return featureElement.value;
        });

    setFilter('features', requiredFeatures);
  }

  housingTypeFilterElement.addEventListener('change', onHousingTypeFilterChange);
  housingPriceFilterElement.addEventListener('change', onHousingPriceFilterChange);
  housingRoomNumberFilterElement.addEventListener('change', onHousingRoomNumberFilterChange);
  housingGuestsNumberFilterElement.addEventListener('change', onHousingGuestsNumberFilterChange);
  housingFeaturesContainer.addEventListener('click', function (event) {
    if (event.target !== housingFeaturesContainer) {
      setRequiredFeaturesFilter();
    }
  });

  function renderPinMapElements() {
    window.pin.removePins();

    var filteredOffers = getFilteredOffers();
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < filteredOffers.length; i++) {
      var pinData = filteredOffers[i];
      var pinElement = window.pin.getPinMapElement(pinData);
      fragment.appendChild(pinElement);

      if (i === 0) {
        window.pin.selectPin(pinElement);
        window.map.openDialog(pinData);
      }
    }
    pinMapBlockElement.appendChild(fragment);
  }

  function closeDialog() {
    offerDialogElement.classList.add('hidden');
  }

  function onDialogEscPress(event) {
    if (event.keyCode === window.utils.KEY_CODES.ESC && window.pin.hasSelectedPin()) {
      window.map.onCloseDialog();
    }
  }

  function onPinMapMainElementMousedown(event) {
    event.preventDefault();

    isDragging = true;
    startCoordsX = event.clientX;
    startCoordsY = event.clientY;

    pinMapMainElementWidth = pinMapMainElement.offsetWidth;
    pinMapMainElementHeight = pinMapMainElement.offsetHeight;
    mapMinX = mapAreaElement.offsetLeft;
    mapMaxX = mapAreaElement.offsetWidth - pinMapMainElementWidth;
    mapMinY = mapAreaElement.offsetTop + MAP_TOP_MARGIN;
    mapMaxY = mapAreaElement.offsetHeight - pinMapMainElementHeight - MAP_BOTTOM_MARGIN;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseMove(event) {
    event.preventDefault();

    if (isDragging) {

      var currentCoords = {
        x: event.clientX,
        y: event.clientY
      };

      var shift = {
        x: currentCoords.x - startCoordsX,
        y: currentCoords.y - startCoordsY
      };

      var newCoords = {
        x: pinMapMainElement.offsetLeft + shift.x,
        y: pinMapMainElement.offsetTop + shift.y
      };

      if (newCoords.x > mapMaxX) {
        newCoords.x = mapMaxX;
      } else if (newCoords.x < mapMinX) {
        newCoords.x = mapMinX;
      }

      if (newCoords.y > mapMaxY) {
        newCoords.y = mapMaxY;
      } else if (newCoords.y < mapMinY) {
        newCoords.y = mapMinY;
      }

      pinMapMainElement.style.left = newCoords.x + 'px';
      pinMapMainElement.style.top = newCoords.y + 'px';
      pinMapMainElement.style.zIndex = '1';

      startCoordsX = currentCoords.x;
      startCoordsY = currentCoords.y;

      var addressCoords = {
        x: newCoords.x + pinMapMainElement.offsetWidth / 2,
        y: newCoords.y + pinMapMainElement.offsetHeight
      };

      window.form.setAddress(addressCoords);
    }
  }

  function onLoadFailure(msgText) {
    window.utils.showOverlayMsg('red', msgText);
  }

  function initFilters() {
    onHousingTypeFilterChange();
    onHousingPriceFilterChange();
    onHousingRoomNumberFilterChange();
    onHousingGuestsNumberFilterChange();
    setRequiredFeaturesFilter();
  }

  window.backend.load(function (receivedOffers) {
    offers = receivedOffers;
    initFilters();
  }, onLoadFailure);

  window.map = {
    openDialog: function (offer) {
      window.showCard(offer, offerDialogElement);
      offerDialogElement.classList.remove('hidden');
    },

    onCloseDialog: function () {
      closeDialog();
      window.pin.clearSelectedPin();
    },
  };

  pinMapMainElement.addEventListener('mousedown', onPinMapMainElementMousedown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
  dialogCloseElement.addEventListener('click', window.map.onCloseDialog);
  pinMapBlockElement.addEventListener('keydown', window.pin.onPinEnterPress);
  document.addEventListener('keydown', onDialogEscPress);
})();
