import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style/App.css';
import FrontPage from './components/frontpage/FrontPage.container';
import TopBar from './components/TopBar.component';
import {beltNameToPath} from './utils/belt';

class App extends Component {
  render() {
    const path = this.props.routerState.path;

    let currentPage = null;
    if (path === '/') {
      currentPage = <FrontPage/>;
    }
    else {
      // check if current path matches a belt
      this.props.beltsState.belts.forEach(belt => {
        if (beltNameToPath(belt.name) === this.props.routerState.path) {
          currentPage = <div>{belt.name}</div>;
        }
      });
    }

    if (!currentPage) {
      currentPage = <div>PAGE NOT FOUND</div>;
    }

    return (
      <div className="App container">
        <TopBar/>
        {currentPage}
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
