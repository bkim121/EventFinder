// make GET requests to facebook Graph API
const token = require('../config.js').FB_TOKEN;
const EventSearch = require("facebook-events-by-location-core");
const request = require('request-promise');

var types = [ 'ARTS_ENTERTAINMENT', 'FITNESS_RECREATION', 'FOOD_BEVERAGE', 'SHOPPING_RETAIL'];

const getFBEvents = ({lat, lng, rad = '10'}) => {
  var FBSearch = new EventSearch();

  var params = {
    lat: lat,
    lng: lng,
    categories: types,
    accessToken: token
  };

  return FBSearch.search(
    params
  ).then((data) => {
    // console.log(JSON.stringify(events));
    // data = JSON.parse(data);
    var events = data.events;
    // console.log('fb events - which one is this?', events);
    return events.map( event => {
      return {
        event: {
          name: event.name,
          givenId: event.id,
          startDate: event.startTime.split('T')[0],
          startTime: event.startTime.split('T')[1].split('-')[0],
          image: event.coverPicture,
          category: event.category ? event.category : "Undefined",
          url: event.ticketing ? event.ticketing : "Tickets at door"
        },

        venue: {
          givenId: event.venue.id,
          name: event.venue.name,
          address: event.venue.location.street + ' ' +
            event.venue.location.zip,
          lat: event.venue.location.latitude,
          lng: event.venue.location.longitude,
          url: "not available",
          postalCode: event.venue.location.zip,
          image: event.venue.coverPicture ? event.venue.coverPicture : null
        }
      };
    });
  }).catch((error) => {
      console.error(JSON.stringify(error));
  });
};

module.exports = {
  getFBEvents
}