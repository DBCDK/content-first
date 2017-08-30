import React, { Component } from 'react';
import logo from './logo.svg';
import './style/App.css';
import FrontPage from './components/frontpage/FrontPage.container';
import TopBar from './components/TopBar.component';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <TopBar/>
        <FrontPage/>
      </div>
    );
  }
}

export default App;
