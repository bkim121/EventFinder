import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import Map from './components/Map.jsx';
import actions from './utils/sendLocation.js';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Legend from './components/Legend.jsx';
import { Transition, Container, Image, Header, Grid, Icon } from 'semantic-ui-react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      display: false,
      name: '',
      userId: '',
      venue: ''
    }
  }

  displayEvents(data, id) {
    var events = actions.formatEvents(data, id);
    this.setState({
      events: events,
      venue: events[0].venue,
      display: true
    }, () => console.log('index venue', this.state.venue));
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

  getUser({name, userId}) {
    this.setState({name, userId});
  }

  favVenue() {
    //make ajax call to server and send user ID and venue info
  }

  render() {
    return (
      <Transition animation='fade up' duration={2000} transitionOnMount={true}>
        <div id="app-container">
          <Navbar getUser={this.getUser.bind(this)}/>
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
          <Legend markers={window.eventTypes}/>
          <Map displayEvents={this.displayEvents.bind(this)} changeDisplay={this.changeDisplay.bind(this)}/>
          { this.state.display &&
            <Sidebar events={this.state.events} hideEvents={this.hideEvents.bind(this)}/>
          }
        </div>
      </Transition>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
