import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style/App.css';
import FrontPage from './components/frontpage/FrontPage.container';
import TopBar from './components/TopBar.component';

class App extends Component {
  render() {
    const belts = this.props.beltsState.belts.map(belt => '/' + belt.name.toLowerCase().replace(/ /g, '-'));
    return (
      <div className="App container">
        <TopBar/>
        {this.props.routerState.path === '/' && <FrontPage/>}
        {belts.includes(this.props.routerState.path) && <div>JEG ER EN GOD BOG</div>}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {routerState: state.routerReducer, beltsState: state.beltsReducer};
  }
)(App);
