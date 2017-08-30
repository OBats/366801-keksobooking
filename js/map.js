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
    pinMapElement.setAttribute('tabindex', 0);

    pinMapImage.src = pinParams.author.avatar;
    pinMapImage.classList.add('rounded');
    pinMapImage.setAttribute('width', 40);
    pinMapImage.setAttribute('height', 40);

    pinMapElement.appendChild(pinMapImage);

    pinMapElement.addEventListener('click', renderDialogElement.bind(null, pinParams));
    pinMapElement.addEventListener('focus', renderDialogElement.bind(null, pinParams));

    return pinMapElement;
  }

  function renderPinMapElements(pinElements) {
    var fragment = document.createDocumentFragment();
    var count = pinElements.length;

    for (var i = 0; i < count; i++) {
      fragment.appendChild(getPinMapElement(pinElements[i]));
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

  var offers = getOffers(8);
  renderPinMapElements(offers);


  var pinMapBlockClickHandler = function (event) {
    if (selectedPin) {
      selectedPin.classList.remove('pin--active');
    }

    selectedPin = event.target;
    while (selectedPin !== pinMapBlock) {
      if (selectedPin.tagName === 'DIV') {
        selectedPin.classList.add('pin--active');
        return;
      }
      selectedPin = selectedPin.parentNode;
    }
  };

  var openDialog = function () {
    offerDialog.classList.remove('hidden');
  };

  var closeDialog = function () {
    offerDialog.classList.add('hidden');
    selectedPin.classList.remove('pin--active');
  };

  var onDialogEscPress = function (event) {
    if (event.keyCode === KEY_CODES.ESC) {
      closeDialog();
    }
  };

  var onPinEnterPress = function (event) {
    if (event.keyCode === KEY_CODES.ENTER) {
      openDialog();
      pinMapBlockClickHandler(event);
    }
  };

  pinMapBlock.addEventListener('click', function (event) {
    openDialog();
    pinMapBlockClickHandler(event);
  });
  pinMapBlock.addEventListener('focus', pinMapBlockClickHandler, true);
  // pinMapBlock.addEventListener('blur', closeDialog, true);
  pinMapBlock.addEventListener('keydown', onPinEnterPress);
  dialogClose.addEventListener('click', closeDialog);
  document.addEventListener('keydown', onDialogEscPress);


  var timeInValue = document.querySelector('#timein');
  var timeOutValue = document.querySelector('#timeout');

  function syncTimeIn() {
    var checkInOutTime = OFFERS_DETAILS.checkInOut;

    for (var i = 0; i < checkInOutTime.length; i++) {
      if (timeInValue.value === checkInOutTime[i]) {
        timeOutValue.value = checkInOutTime[i];
      }
    }
  }

  function syncTimeOut() {
    var checkInOutTime = OFFERS_DETAILS.checkInOut;

    for (var i = 0; i < checkInOutTime.length; i++) {
      if (timeOutValue.value === checkInOutTime[i]) {
        timeInValue.value = checkInOutTime[i];
      }
    }
  }

  timeInValue.addEventListener('change', syncTimeIn);
  timeOutValue.addEventListener('change', syncTimeOut);

  var housingType = document.querySelector('#type');
  var nightPrice = document.querySelector('#price');

  function syncTypePrice() {
    var types = OFFERS_DETAILS.types;
    var rusHousingTypes = RUSSIAN_HOUSING_TYPES;

    types.push('palace');
    rusHousingTypes.palace = 'Дворец';

    // for (var i = 0; i < types.length; i++) {
    switch (housingType.value) {
      case types[0]:
        nightPrice.value = '1000';
        nightPrice.min = nightPrice.value;
        break;
      case types[1]:
        nightPrice.value = '5000';
        nightPrice.min = nightPrice.value;
        break;
      case types[2]:
        nightPrice.value = '0';
        nightPrice.min = nightPrice.value;
        break;
      case types[3]:
        nightPrice.value = '10000';
        nightPrice.min = nightPrice.value;
        break;
      default:
        nightPrice.value = '1000';
        nightPrice.min = nightPrice.value;
        break;
    }
    // };
  }
  housingType.addEventListener('change', syncTypePrice);
})();
