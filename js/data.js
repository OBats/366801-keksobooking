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

  window.data = {
    getOffers: function (offerAmount) {
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
  };
})();
