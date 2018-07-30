import $ from 'jquery';
import KEY from '../../config.js';

window.eventTypes = {
  'All': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  'Music': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  'Arts & Theatre': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  'Film': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  'Sports': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  'Miscellaneous': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'

}

var actions = {
  get: function(google, map, type, cb) {
    return $.ajax('/events')
    .then(data => {

      // return this._prepMarkers(data, cb, google, map)
      // .then(markers => {
      //   return {events: data, markers: markers}
      // });

      var info = [];
      data.forEach(el => {
        el.forEach(inception => {
          info.push(inception)
        })
      })
      console.log(type)
      if (type === null || type.toLowerCase() === 'all' || type === undefined) {
        return this._prepMarkers(info, cb, google, map)
        .then(markers => {
          return {events: info, markers: markers}
        });
      } else {
        var array = [];
        info.forEach(el => {
          if (el.event !== undefined) {
            if (el.event.category === type){
              array.push(el);
            }
          }
        })
        console.log(array)
        return this._prepMarkers(array, cb, google, map)
          .then(markers => {
          return {events: array, markers: markers}
        });
      }
    })
  },

  post: (lat, lng, type, google, map, cb) => {
    return $.ajax({
      method: 'POST',
      url: '/events',
      data: {
        data: JSON.stringify({
          lat: lat,
          lng: lng,
          type: type,
          rad: 4
        })
      }
    })
    .then(data => {
      if (type === null || type === 'all' || type === undefined) {
        return this.a._prepMarkers(data, cb, google, map)
        .then(markers => {
          return {events: data, markers: markers}
        });
      } else {
        var info = [];
        data.forEach(el => {
          if (el.event !== undefined) {
            if (el.event.category === type){
              info.push(el);
            }
          }
        })
        return this.a._prepMarkers(info, cb, google, map)
          .then(markers => {
          return {events: data, markers: markers}
        });
      }
    })
    .fail((err) => {
      console.error(err);
    });
  },

  sort: (type, google, map, cb) => {
    return $.ajax({
      method: 'PATCH',
      url: '/sort',
      contentType: 'application/json',
      data: JSON.stringify({
        type: type
      })
    })
  },

  _pinMarker: (lat, lng, event, google, map) => {
    return new google.maps.Marker({
      map: map,
      icon: eventTypes[event.event.category],
      position: new google.maps.LatLng(lat, lng),
      venueId: event.venue.givenId
    });
  },

  _prepMarkers: (data, cb, google, map) => {
    if (data.length === 2 && Array.isArray(data[0])) {
      var badFormat = data.slice();
      data = badFormat[0].concat(badFormat[1]);
    }
    return Promise.all(data.map(event => {
      return this.a.getCoordinate(event.venue.address, event.venue.postalCode)
      .then(({lat, lng}) => {
        var marker = this.a._pinMarker(lat, lng, event, google, map);
        console.log(event)
        marker.addListener('click', () => {
          cb(data, marker.venueId);
        });
        this.a._createInfoWindow(marker, event, google, map);
        return marker;
      })
    }));
  },

  _createInfoWindow: (marker, event, google, map) => {
    var infowindow = new google.maps.InfoWindow({
      content:
        `<div class='content'>
          <h3> ${event.venue.name}</h3>
          <img src=${event.venue.image} height='75px' width='auto'/>
          <p> <a href=${event.venue.url} target='_blank'>Venue Details</a</p>
        </div>`,
        maxWidth: 150
    });

    marker.info = infowindow;

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  },

  removeMarkers: markers => {
    markers.forEach(marker => marker.setMap(null))
  },

  getCoordinate(address, postalCode) {
    return $.ajax({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address+postalCode},+CA&key=${KEY.KEY}`,
      type: "GET",
      format: 'application/JSON'
    })
    .then(data => {
      return data.results[0].geometry.location
    })
    .catch(err => {
      console.error(err);
    });

  },

  formatEvents: (events, id) => {
    return events.filter((event) => {
      if (event.venue.givenId === id) {
        return event.event;
      }
    }).sort(function(event1, event2){
      return new Date(event1.event.startDate) - new Date(event2.event.startDate);
    });
  },

  addInfowindowClose: markers => {
    markers.forEach((marker) => {
      marker.addListener('click', (event) => {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        for (var venue of markers) {
          if (venue.position.lat() !== lat && venue.position.lng()) {
            venue.info.close();
          }
        }
      });
    });
  }
}



export default actions;
