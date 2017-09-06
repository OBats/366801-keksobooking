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

  window.data = {
    getOffers: function (offerAmount) {
      var getRandomAvatar = window.utils.createRandomArrayItemGetter(OFFERS_DETAILS['avatars']);
      var getRandomTitle = window.utils.createRandomArrayItemGetter(OFFERS_DETAILS['titles']);
      var getRandomHousingType = window.utils.createRandomArrayItemGetter(OFFERS_DETAILS['types']);
      var getRandomCheckInOut = window.utils.createRandomArrayItemGetter(OFFERS_DETAILS['checkInOut']);
      var randomFeatures = OFFERS_DETAILS['features'];
      var avatarPath = 'img/avatars/user0';

      var offers = [];

      for (var i = 0; i < offerAmount; i++) {
        var location = {
          x: window.utils.getRandomNumber(300, 900),
          y: window.utils.getRandomNumber(100, 500)
        };

        offers.push({
          author: {
            avatar: avatarPath + getRandomAvatar() + '.png'
          },
          offer: {
            title: getRandomTitle(),
            address: location.x + ', ' + location.y,
            price: window.utils.getRandomNumber(1000, 1000000),
            type: getRandomHousingType(),
            rooms: window.utils.getRandomNumber(1, 5),
            quests: window.utils.getRandomNumber(1, 10),
            checkin: getRandomCheckInOut(),
            checkout: getRandomCheckInOut(),
            features: window.utils.getRandomArrayLength(randomFeatures),
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
