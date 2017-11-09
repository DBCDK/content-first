import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style/App.css';
import './style/index.css';
import './style/filterpage.css';
import './style/work.css';
import FrontPage from './components/frontpage/FrontPage.container';
import FilterPage from './components/filter/FilterPage.container';
import WorkPage from './components/work/WorkPage.container';
import ProfilePage from './components/profile/ProfilePage.container';
import TopBar from './components/TopBar.component';
import {beltNameToPath} from './utils/belt';

class App extends Component {
  render() {
    const path = this.props.routerState.path;
    const pathSplit = path.split('/');

    let currentPage = null;
    if (pathSplit[1] === '') {
      currentPage = <FrontPage/>;
    }
    else if (pathSplit[1] === 'værk') {
      currentPage = <WorkPage pid={pathSplit[2]}/>;
    }
    else if (pathSplit[1] === 'profile') {
      currentPage = <ProfilePage />;
    }
    else {
      // check if current path matches a belt
      this.props.beltsState.belts.forEach(belt => {
        if (beltNameToPath(belt.name) === path) {
          currentPage = <FilterPage belt={belt}/>;
        }
      });
    }

    if (!currentPage) {
      currentPage = <div>PAGE NOT FOUND</div>;
    }

    return (
      <div className="App container">
        <TopBar dispatch={this.props.dispatch}/>
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
