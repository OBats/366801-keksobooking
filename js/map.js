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

  var lodgeTemplate = document
      .querySelector('#lodge-template')
      .content
      .querySelector('.dialog__panel');


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

  function getConvertedHousingType(types) {
    var housingType;
    var count = types.length;

    for (var i = 0; i < count; i++) {
      var randomIndex = Math.floor(Math.random() * count);
      switch (types[randomIndex]) {
        case 'house':
          housingType = 'Дом';
          break;
        case 'bungalo':
          housingType = 'Бунгало';
          break;
        default:
          housingType = 'Квартира';
          break;
      }
    }

    return housingType;
  }

  function getOffers(offerAmount) {
    var getRandomAvatar = createRandomArrayItemGetter(OFFERS_DETAILS['avatars']);
    var getRandomTitle = createRandomArrayItemGetter(OFFERS_DETAILS['titles']);
    var randomHousingType = OFFERS_DETAILS['types'];
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
          type: getConvertedHousingType(randomHousingType),
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

  function getPinMapElements(params) {
    var pinMapElement = document.createElement('div');
    var pinMapImage = document.createElement('img');

    var pinMapImageCoordinates = {
      x: params.location.x + (56 * 0.5) + 'px',
      y: params.location.y + 75 + 'px'
    };

    pinMapElement.classList.add('pin');
    pinMapElement.style.left = pinMapImageCoordinates.x;
    pinMapElement.style.top = pinMapImageCoordinates.y;

    pinMapImage.src = params.author.avatar;
    pinMapImage.classList.add('rounded');
    pinMapImage.setAttribute('width', 40);
    pinMapImage.setAttribute('height', 40);

    pinMapElement.appendChild(pinMapImage);

    return pinMapElement;
  }

  function renderPinMapElements(params) {
    var fragment = document.createDocumentFragment();
    var pinMapBlock = document.querySelector('.tokyo__pin-map');
    var count = params.length;

    for (var i = 0; i < count; i++) {
      fragment.appendChild(getPinMapElements(params[i]));
    }
    pinMapBlock.appendChild(fragment);
  }

  function getDialogElement(element) {
    var offerDialogTemplate = lodgeTemplate.cloneNode(true);
    var offerFeatures = element.offer.features;

    offerDialogTemplate.querySelector('.lodge__title')
        .textContent = element.offer.title;

    offerDialogTemplate.querySelector('.lodge__address')
        .textContent = element.offer.address;

    offerDialogTemplate.querySelector('.lodge__price')
        .innerHTML = element.offer.price + '&#x20bd;/ночь';

    offerDialogTemplate.querySelector('.lodge__type')
        .textContent = element.offer.type;

    offerDialogTemplate
        .querySelector('.lodge__rooms-and-guests')
        .innerHTML = 'Для ' + element.offer.quests +
      ' гостей в ' + element.offer.rooms + ' комнатах';

    offerDialogTemplate
        .querySelector('.lodge__checkin-time')
        .innerHTML = 'Заезд после ' + element.offer.checkin +
      ', выезд до ' + element.offer.checkout;

    offerDialogTemplate.querySelector('.lodge__description')
        .textContent = element.offer.description;

    for (var i = 0; i < offerFeatures.length; i++) {
      var emptySpan = document.createElement('span');

      emptySpan.classList
          .add('feature__image', 'feature__image--' + offerFeatures[i]);
      offerDialogTemplate.querySelector('.lodge__features')
          .appendChild(emptySpan);
    }
    return offerDialogTemplate;
  }

  function renderDialogElement(params) {
    var offerDialog = document.querySelector('#offer-dialog');
    var dialogPanel = offerDialog.querySelector('.dialog__panel');

    offerDialog.querySelector('.dialog__title > img').src = params.author.avatar;

    offerDialog.replaceChild(getDialogElement(params), dialogPanel);
  }

  var offers = getOffers(8);
  renderPinMapElements(offers);
  renderDialogElement(offers[0]);
})();
