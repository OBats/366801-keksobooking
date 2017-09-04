'use strict';

(function () {
  var OFFERS_DETAILS = {
    avatars: [1, 2, 3, 4, 5, 6, 7, 8],
    titles: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    types: ['flat', 'house', 'bungalo'],
    checkInOut: ['12:00', '13:00', '14:00'],
    features: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ]
  };

  var RUSSIAN_HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var KEY_CODES = {
    ESC: 27,
    ENTER: 13
  };

  var lodgeTemplate = document
      .querySelector('#lodge-template')
      .content
      .querySelector('.dialog__panel');

  var pinMapBlock = document.querySelector('.tokyo__pin-map');
  var offerDialog = document.querySelector('#offer-dialog');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var housingType = document.querySelector('#type');
  var roomNumber = document.querySelector('#room_number');
  var focusedPinElement;
  var focusedPinContent;
  var selectedPin;


  function createRandomArrayItemGetter(array) {
    var randomSource = array.slice();

    return function () {
      var randomNumber;
      if (randomSource.length === 1) {
        randomNumber = randomSource[0];
        randomSource = array.slice();
      } else {
        var randomId = Math.floor(Math.random() * randomSource.length);
        randomNumber = randomSource[randomId];
        randomSource.splice(randomId, 1);
      }
      return randomNumber;
    };
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomArrayLength(array) {
    var randomLength = array.length - Math.floor(Math.random() * array.length);

    return array.slice(0, randomLength);
  }

  function getOffers(offerAmount) {
    var getRandomAvatar = createRandomArrayItemGetter(OFFERS_DETAILS['avatars']);
    var getRandomTitle = createRandomArrayItemGetter(OFFERS_DETAILS['titles']);
    var getRandomHousingType = createRandomArrayItemGetter(OFFERS_DETAILS['types']);
    var getRandomCheckInOut = createRandomArrayItemGetter(OFFERS_DETAILS['checkInOut']);
    var randomFeatures = OFFERS_DETAILS['features'];
    var avatarPath = 'img/avatars/user0';

    var offers = [];

    for (var i = 0; i < offerAmount; i++) {
      var location = {
        x: getRandomNumber(300, 900),
        y: getRandomNumber(100, 500)
      };

      offers.push({
        author: {
          avatar: avatarPath + getRandomAvatar() + '.png'
        },
        offer: {
          title: getRandomTitle(),
          address: location.x + ', ' + location.y,
          price: getRandomNumber(1000, 1000000),
          type: getRandomHousingType(),
          rooms: getRandomNumber(1, 5),
          quests: getRandomNumber(1, 10),
          checkin: getRandomCheckInOut(),
          checkout: getRandomCheckInOut(),
          features: getRandomArrayLength(randomFeatures),
          description: '',
          photos: []
        },
        location: location
      });
    }

    return offers;
  }

  function getPinMapElement(pinParams) {
    var pinMapElement = document.createElement('div');
    var pinMapImage = document.createElement('img');

    var pinMapImageCoordinates = {
      x: pinParams.location.x + (56 * 0.5) + 'px',
      y: pinParams.location.y + 75 + 'px'
    };

    pinMapElement.classList.add('pin');
    pinMapElement.style.left = pinMapImageCoordinates.x;
    pinMapElement.style.top = pinMapImageCoordinates.y;

    pinMapImage.src = pinParams.author.avatar;
    pinMapImage.classList.add('rounded');
    pinMapImage.setAttribute('width', 40);
    pinMapImage.setAttribute('height', 40);
    pinMapImage.setAttribute('tabindex', 0);
    pinMapImage.addEventListener('focus', onPinFocus.bind(null, pinMapElement, pinParams));
    pinMapImage.addEventListener('blur', onPinLoseFocus);

    pinMapElement.appendChild(pinMapImage);
    pinMapElement.addEventListener('click', onPinClick.bind(null, pinMapElement, pinParams));

    return pinMapElement;
  }

  function renderPinMapElements(pinElements) {
    var fragment = document.createDocumentFragment();
    var count = pinElements.length;

    for (var i = 0; i < count; i++) {
      var pinData = pinElements[i];
      var pinElement = getPinMapElement(pinData);
      fragment.appendChild(pinElement);

      if (i === 0) {
        selectPin(pinElement);
        openDialog(pinData);
      }
    }

    pinMapBlock.appendChild(fragment);
  }

  function getDialogElement(element) {
    var offerDialogTemplate = lodgeTemplate.cloneNode(true);
    var offerFeatures = element.offer.features;

    var lodgeTitle = offerDialogTemplate.querySelector('.lodge__title');
    var lodgeAddress = offerDialogTemplate.querySelector('.lodge__address');
    var lodgePrice = offerDialogTemplate.querySelector('.lodge__price');
    var lodgeType = offerDialogTemplate.querySelector('.lodge__type');
    var lodgeRoomsAndGuests = offerDialogTemplate.querySelector('.lodge__rooms-and-guests');
    var lodgeCheckinTime = offerDialogTemplate.querySelector('.lodge__checkin-time');
    var lodgeDescription = offerDialogTemplate.querySelector('.lodge__description');

    lodgeTitle.textContent = element.offer.title;
    lodgeAddress.textContent = element.offer.address;
    lodgePrice.textContent = element.offer.price + ' \u20BD/ночь';
    lodgeType.textContent = RUSSIAN_HOUSING_TYPES[element.offer.type];
    lodgeRoomsAndGuests.textContent = 'Для ' + element.offer.quests +
        ' гостей в ' + element.offer.rooms + ' комнатах';
    lodgeCheckinTime.textContent = 'Заезд после ' + element.offer.checkin +
        ', выезд до ' + element.offer.checkout;
    lodgeDescription.textContent = element.offer.description;

    for (var i = 0; i < offerFeatures.length; i++) {
      var emptySpan = document.createElement('span');

      emptySpan.classList
          .add('feature__image', 'feature__image--' + offerFeatures[i]);
      offerDialogTemplate.querySelector('.lodge__features')
          .appendChild(emptySpan);
    }

    return offerDialogTemplate;
  }

  function renderDialogElement(offer) {
    var dialogPanel = offerDialog.querySelector('.dialog__panel');

    offerDialog.querySelector('.dialog__title > img').src = offer.author.avatar;

    offerDialog.replaceChild(getDialogElement(offer), dialogPanel);
  }

  function setFocusedPin(pinElement, pinData) {
    focusedPinElement = pinElement;
    focusedPinContent = pinData;
  }

  function clearFocusedPin() {
    focusedPinElement = null;
    focusedPinContent = null;
  }

  function openDialog(offer) {
    renderDialogElement(offer);
    offerDialog.classList.remove('hidden');
  }

  function closeDialog() {
    offerDialog.classList.add('hidden');
  }

  function selectPin(pinElement) {
    clearSelectedPin(selectedPin);
    selectedPin = pinElement;
    selectedPin.classList.add('pin--active');
  }

  function clearSelectedPin() {
    if (selectedPin) {
      selectedPin.classList.remove('pin--active');
      selectedPin = null;
    }
  }

  function onPinFocus(pinElement, pinData) {
    setFocusedPin(pinElement, pinData);
  }

  function onPinLoseFocus() {
    clearFocusedPin();
  }

  function onPinClick(pinElement, pinData) {
    selectPin(pinElement);
    openDialog(pinData);
  }

  function onCloseDialog() {
    closeDialog();
    clearSelectedPin();
  }

  function onDialogEscPress(event) {
    if (event.keyCode === KEY_CODES.ESC && selectedPin) {
      onCloseDialog();
    }
  }

  function onPinEnterPress(event) {
    if (event.keyCode === KEY_CODES.ENTER && focusedPinElement) {
      onPinClick(focusedPinElement, focusedPinContent);
    }
  }

  function syncTimeIn() {
    if (timeIn.value !== timeOut.value) {
      timeOut.value = timeIn.value;
    }
  }

  function syncTypeWithPrice() {
    var nightPrice = document.querySelector('#price');

    switch (housingType.value) {
      case 'flat':
        nightPrice.min = '1000';
        break;
      case 'house':
        nightPrice.min = '5000';
        break;
      case 'palace':
        nightPrice.min = '10000';
        break;
      default:
        nightPrice.min = '0';
        break;
    }
    nightPrice.value = nightPrice.value || nightPrice.min;
  }

  function syncRoomsWithCapacity() {
    var capacity = document.querySelector('#capacity');
    var childrens = capacity.children;
    var forOneQuest = childrens[2];
    var forTwoQuests = childrens[1];
    var forThreeQuests = childrens[0];
    var notForQuests = childrens[3];

    capacity.value = roomNumber.value;

    for (var i = 0; i < childrens.length; i++) {
      childrens[i].setAttribute('disabled', null);
    }

    if (roomNumber.value === '1') {
      forOneQuest.removeAttribute('disabled');
    } else if (roomNumber.value === '2') {
      forOneQuest.removeAttribute('disabled');
      forTwoQuests.removeAttribute('disabled');
    } else if (roomNumber.value === '3') {
      forOneQuest.removeAttribute('disabled');
      forTwoQuests.removeAttribute('disabled');
      forThreeQuests.removeAttribute('disabled');
    } else {
      notForQuests.removeAttribute('disabled');
      capacity.value = '0';
    }
  }

  dialogClose.addEventListener('click', onCloseDialog);
  pinMapBlock.addEventListener('keydown', onPinEnterPress);
  document.addEventListener('keydown', onDialogEscPress);

  timeIn.addEventListener('change', syncTimeIn);
  housingType.addEventListener('change', syncTypeWithPrice);
  roomNumber.addEventListener('change', syncRoomsWithCapacity);

  var offers = getOffers(8);
  renderPinMapElements(offers);
})();
