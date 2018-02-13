import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style/App.css';
import './style/index.css';
import './style/filterpage.css';
import './style/work.css';
import Modal from './components/modals/Modal.container';
import FrontPage from './components/frontpage/FrontPage.container';
import FilterPage from './components/filter/FilterPage.container';
import SearchPage from './components/search/SearchPage.container';
import WorkPage from './components/work/WorkPage.container';
import ProfilePage from './components/profile/ProfilePage.container';
import Bookcase from './components/bookcase/Bookcase.component';
import TopBar from './components/top/TopBar.component';
import {beltNameToPath} from './utils/belt';
import {ON_USER_DETAILS_REQUEST} from './redux/profile.reducer';
import ListPage from './components/list/ListPage.container';
import ListCreator from './components/list/ListCreate.container';
import Lists from './components/list/Lists.container';
import ShortList from './components/list/ShortList.container';

class App extends Component {
  componentWillMount() {
    this.props.dispatch({type: ON_USER_DETAILS_REQUEST});
  }

  render() {
    const path = this.props.routerState.path;
    const pathSplit = path.split('/');

    let currentPage = null;
    if (pathSplit[1] === '') {
      currentPage = <FrontPage />;
    } else if (pathSplit[1] === 'værk') {
      currentPage = <WorkPage pid={pathSplit[2]} />;
    } else if (pathSplit[1] === 'profile') {
      currentPage = <ProfilePage />;
    } else if (pathSplit[1] === 'lister') {
      if (pathSplit[2]) {
        if (pathSplit[2] === 'opret') {
          currentPage = <ListCreator />;
        } else if (pathSplit[3] === 'rediger') {
          currentPage = <ListCreator id={pathSplit[2]} />;
        } else {
          currentPage = <ListPage id={pathSplit[2]} />;
        }
      } else {
        currentPage = <Lists />;
      }
    } else if (pathSplit[1] === 'huskeliste') {
      currentPage = <ShortList />;
    } else if (pathSplit[1] === 'søg') {
      currentPage = <SearchPage />;
    } else if (pathSplit[1] === 'bogreol') {
      currentPage = <Bookcase />;
    } else {
      // check if current path matches a belt
      this.props.beltsState.belts.forEach(belt => {
        if (beltNameToPath(belt.name) === path) {
          currentPage = <FilterPage belt={belt} />;
        }
      });
    }

    if (!currentPage) {
      currentPage = <div>PAGE NOT FOUND</div>;
    }

    return (
      <div className="App container">
        <TopBar
          dispatch={this.props.dispatch}
          user={this.props.profileState.user}
        />
        <div style={{height: '50px'}} />
        {currentPage}
        <Modal />
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  state => {
    return {
      routerState: state.routerReducer,
      beltsState: state.beltsReducer,
      profileState: state.profileReducer
    };
  }
)(App);
