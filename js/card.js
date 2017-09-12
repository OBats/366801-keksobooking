'use strict';

(function () {

  var RUSSIAN_HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var lodgeTemplate = document
      .querySelector('#lodge-template')
      .content
      .querySelector('.dialog__panel');

  window.card = {
    createCard: function (element) {
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
      lodgeRoomsAndGuests.textContent = 'Для ' + element.offer.guests +
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
  };
})();
