const Express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const ticketmaster = require('./ticketmaster.js');
// const fb = require('./facebook.js');
const db = require('../db/index.js');
const cors = require('cors');

const app = Express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

//Serve up static html
app.use(Express.static(__dirname + '/../client'));

app.get('/events', (req, res) => {
  var requestBody = Object.keys(req.body).length ? req.body : {
    lat: 37.788799,
    lng: -122.394798,
    rad: 25
  };

   var range = 0.0145 * requestBody.rad;
   var options = {
     center_lat: requestBody.lat,
     center_lng: requestBody.lng,
     range: range
   };

  db.searchEvents(options)
    var promise1 = Promise.resolve(ticketmaster.getEvents(requestBody));
    // var promise2 = Promise.resolve(fb.getFBEvents(requestBody));
    // Promise.all([promise1, promise2])
    Promise.all([promise1])
    .then(allEvents => {
      if (allEvents.length !== 0) {
       throw allEvents;
      }
      return allEvents;
    })
    .then(apiEvents => {
      return Promise.all(apiEvents.map( event => {
        return db.searchOrCreateVenue(event.venue)
        .then( id => {
          event.event.venueId = id;
          return db.addNewEvents(event);
        });
      }))

    })
    .then( events => {
      res.send(events)
    })
    .catch( events => {
      //console.log('What am I catching?', events);
      res.send(events)
    })
  // ticketmaster.getEvents(requestBody)
  // .then((processedData) => {
  //   console.log(JSON.stringify(processedData));
  //   res.status(200).send(processedData);
  // })
  // .catch((err) => {
  //   console.error(err);
  // });

})

app.post('/events', (req, res) => {
  var params = JSON.parse(req.body.data);
  var range = 0.0145 * params.rad;
  var options = {
    center_lat: params.lat,
    center_lng: params.lng,
    range: range
  };
 db.searchEvents(options)
   // .then(events => {
   //   if (events.length !== 0) {
   //     throw events;
   //   }
   //   return ticketmaster.getEvents(params)
   // })
    var promise1 = Promise.resolve(ticketmaster.getEvents(params));
    // var promise2 = Promise.resolve(fb.getFBEvents(params));
    // Promise.all([promise1, promise2])
    Promise.all([promise1])
    .then(allEvents => {
      if (allEvents.length !== 0) {
        throw allEvents;
      }
      console.log('are these they', allEvents[0].concat(allEvents[1]));
      return allEvents[0].concat(allEvents[1]);
    })
   .then(apiEvents => {
     return Promise.all(apiEvents.map( event => {
       return db.searchOrCreateVenue(event.venue)
       .then( id => {
         // console.log('IS THE ID COMING BACK?', id);
         // console.log('After ID, we add ID to event:', event);
         event.event.venueId = id;
         return db.addNewEvents(event);
       });
     }))

   })
   .then( events => {
     //console.log('Returning this to client:', events);
     res.send(events)
   })
   .catch( events => {
     //console.log('What am I catching?', events);
     res.send(events)
   })
})


app.post('/addToMyVenues', (req, res) => {
  var venueObj = req.body;
  return new Promise((resolve, reject) => resolve(db.searchOrCreateMyVenues(venueObj)))
    .then(success => res.send(success))
});

app.post('/addToMyEvents', (req, res) => {
  var eventObj = req.body;
  return new Promise((resolve, reject) => resolve(db.searchOrCreateMyEvents(eventObj)))
    .then(success => res.send(success))
});

app.post('/dashboard', (req, res) => {
  var userId = req.body.userId;
  return new Promise((resolve, reject) => {
    resolve(db.searchForUserMyEvents(userId));
  })
  .then(success => res.send(success))
  .catch(err => res.send(err))
});

app.post('/dashboardVenues', (req, res) => {
  var userId = req.body.userId;
  return new Promise((resolve, reject) => {
    resolve(db.searchForUserMyVenues(userId));
  })
  .then(success => res.send(success))
  .catch(err => res.send(err))
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on Port 3000!');
});
