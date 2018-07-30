import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import GoogleMapsLoader from 'google-maps';
import mapStyles from './utils/mapStyles.js';
import Search from './components/Search.jsx';
import Map from './components/Map.jsx';
import actions from './utils/sendLocation.js';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Legend from './components/Legend.jsx';
import KEY from '../config.js';
import { Transition, Container, Image, Header, Grid, Icon, Dimmer, Segment } from 'semantic-ui-react';
import Dashboard from './components/Dashboard.jsx';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.markers = null;
    this.state = {
      list: {},
      events: [],
      display: false,
      name: '',
      userId: '',
      venue: '',
      long: 0,
      lat: 0,
      selectedEvent: {},
      dashboard: false,
      loggedIn: false,
      addVenueOrEventDimmerActive: false,
      logInDimmerActive: false
    }
  }

  toggleDimmer(){
    this.setState({ addVenueOrEventDimmerActive: !this.state.addVenueOrEventDimmerActive })
  }

  togglelogInDimmer(){
    this.setState({ logInDimmerActive: !this.state.logInDimmerActive })
  }

  handleShowLoginMsg(){
    this.setState({ active: true })
  }
  handleHideLoginMsg(){
    this.setState({ active: false })
  }

  displayEvents(data, id) {
    var events = actions.formatEvents(data, id);
    this.setState({
      events: events,
      venue: events[0].venue,
      display: true
    }, () => console.log('index events', this.state.events));
  }

  hideEvents() {
    this.setState({
      display: false
    });
  }

  changeDisplay() {
    this.setState({
      display: false
    });
  }

  getUser({name, id}) {
    this.setState({name, userId: id, loggedIn: true});
  }

  showInfo(long, lat) {
    this.setState({
      long: long,
      lat: lat
    })
  }

  sortMarkers(type){
    this.changeDisplay();
  }



  addToMyVenues() {
    // if they are not logged in, give an error message
    if (!this.state.name) {
      this.togglelogInDimmer()
    } else {
    //make ajax call to server and send user ID and venue info
      $.ajax({
        method: 'POST',
        url: '/addToMyVenues',
        contentType: 'application/json',
        data: JSON.stringify({
          userId: this.state.userId,
          givenId: this.state.venue.givenId,
          venueName: this.state.venue.name
          // address: this.state.venue.address,
          // lat: this.state.venue.lat,
          // lng: this.state.venue.lng,
          // url: this.state.venue.url,
          // postalCode: this.state.venue.postalCode,
          // image: this.state.venue.image
        }),
        success: data => this.toggleDimmer()
      });
    }
  }

  addToMyEvents() {
    // if they are not logged in, give an error message
    if (!this.state.name) {
      this.togglelogInDimmer()
    } else {
    //make ajax call to server and send user ID and venue info
      $.ajax({
        method: 'POST',
        url: '/addToMyEvents',
        contentType: 'application/json',
        data: JSON.stringify({
          userId: this.state.userId,
          eventId: this.state.selectedEvent.givenId
        }),
        success: data => this.toggleDimmer()
      });
    }
    // need to save to both event and schedule tables
  }

  selectEvent(selectedEvent) {
    this.setState({selectedEvent}, this.addToMyEvents);
  }

  changeView() {
    if (!this.state.userId) {
      this.togglelogInDimmer();
    } else {
      this.setState({dashboard: !this.state.dashboard});
    }
  }

  render() {
    const { active } = this.state
    return (<div>

      <Dimmer
          active={this.state.addVenueOrEventDimmerActive}
          onClick={this.toggleDimmer.bind(this)}
          page
        >
      <Header as='h2' icon inverted>
            <Icon name='check circle' />
            Added to your dashboard!
          </Header>
        </Dimmer>

      <Dimmer
        active={this.state.logInDimmerActive}
        onClick={this.togglelogInDimmer.bind(this)}
        page
      >
        <Header as='h2' icon inverted>
            <Icon name='facebook square' />
            Please log in
          </Header>
      </Dimmer>

      <Navbar getUser={this.getUser.bind(this)} changeView={this.changeView.bind(this)} loggedIn={this.state.loggedIn}/>
      {this.state.dashboard === false
      ?
      <div id="app-container">
        <Container fluid style={{ backgroundImage: "url('http://i64.tinypic.com/2r7stqh.jpg')", height: '550px'}}>
          <Header size='huge' id='welcome'>Welcome {this.state.name}</Header>
          <p></p>
          <div><Icon name='arrow down' size='mini'/></div>
          <div><Icon name='arrow down' size='tiny'/></div>
          <div><Icon name='arrow down' size='small'/></div>
          <div><Icon name='arrow down' size='large'/></div>
          <div><Icon name='arrow down' size='big'/></div>
          <div><Icon name='arrow down' size='huge'/></div>
          <Search />
          <div><Icon name='arrow up' size='huge'/></div>
          <div><Icon name='arrow up' size='big'/></div>
          <div><Icon name='arrow up' size='large'/></div>
          <div><Icon name='arrow up' size='small'/></div>
          <div><Icon name='arrow up' size='tiny'/></div>
          <div><Icon name='arrow up' size='mini'/></div>
        </Container>
        <Legend sort={this.sortMarkers.bind(this)} markers={window.eventTypes}/>
        <Map information={this.state.list} retreiveInfo={this.showInfo.bind(this)} displayEvents={this.displayEvents.bind(this)} changeDisplay={this.changeDisplay.bind(this)}/>
        { this.state.display &&
          <Sidebar events={this.state.events} hideEvents={this.hideEvents.bind(this)} addToMyVenues={this.addToMyVenues.bind(this)} selectEvent={this.selectEvent.bind(this)}/>
        }
      </div>
      :
      <Dashboard userId={this.state.userId}/>
      }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));



  // sortMarkers(type){
  //   GoogleMapsLoader.KEY = KEY.KEY;
  //   GoogleMapsLoader.LIBRARIES = ['places'];

  //   GoogleMapsLoader.load(google => {
  //     var map = new google.maps.Map(document.getElementById('map'), {
  //       zoom: 14,
  //       center: new google.maps.LatLng(this.state.long, this.state.lat),
  //       disableDefaultUI: false,
  //       styles: mapStyles
  //     });
  //     var currentLat = this.state.lat;
  //     var currentLng = this.state.long
  //     var input = document.getElementById('search-input');
  //     var searchBox = new google.maps.places.SearchBox(input);

  //     map.addListener('dragend', () => {
  //       console.log('i was dragged!');
  //       searchBox.setBounds(map.getBounds());
  //       var newLat = map.getBounds().getCenter().lat();
  //       var newLng = map.getBounds().getCenter().lng();
  //       currentLat = newLat;
  //       currentLng = newLng;
  //       var newLocation = { lat: newLat, lng: newLng };
  //       var service = new google.maps.places.PlacesService(map);
  //       service.nearbySearch({
  //         location: newLocation,
  //         radius: 500
  //       }, (places, service, pagination) => {
  //         this.search(places, google, map);
  //         console.log(currentLat, currentLng)
  //       });
  //     });

  //     searchBox.addListener('places_changed', () => {
  //       this.search(searchBox.getPlaces(), google, map);
  //     });

  //     var results = actions.get(google, map, type, this.displayEvents.bind(this))
  //     .then((results) => {
  //       this.showInfo(currentLat, currentLng)
  //       console.log(this.state.lat, this.state.long)
  //       this.markers = results.markers
  //       actions.addInfowindowClose(this.markers);
  //     });
  //   });

  //   this.changeDisplay();

  // }

  // search(places, google, map) {
  //   var bounds = new google.maps.LatLngBounds();
  //   var searchLat;
  //   var searchLng;
  //   places.forEach(place => {
  //     if (place.geometry.viewport) {
  //       bounds.union(place.geometry.viewport);
  //       searchLat = place.geometry.location.lat();
  //       searchLng = place.geometry.location.lng();
  //     } else {
  //       bounds.extend(place.geometry.location);
  //     }
  //   });

  //   this.showInfo(searchLat, searchLng)

  //   map.fitBounds(bounds);
  //   map.setCenter({lat: searchLat, lng: searchLng})
  //   map.setZoom(14);

  //   actions.post(searchLat, searchLng, null, google, map, this.displayEvents.bind(this))
  //   .then((results) => {
  //     this.markers = results.markers;
  //     actions.addInfowindowClose(this.markers);
  //     this.setState({
  //       long: searchLng,
  //       lat: searchLat
  //     })
  //   });

  //   // Hide sidebar display upon new location search
  //   this.changeDisplay();
  // }
