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
import TastePage from './components/profile/TastePage.container';
import ProfilePage from './components/profile/ProfilePage.container';
import CreateProfilePage from './components/profile/CreateProfilePage';
import TopBar from './components/top/TopBar.component';
import {beltNameToPath} from './utils/belt';
import {ON_USER_DETAILS_REQUEST} from './redux/user.reducer';
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
    let topbar = true;
    if (pathSplit[1] === '') {
      currentPage = <FrontPage />;
    } else if (pathSplit[1] === 'værk') {
      currentPage = <WorkPage pid={pathSplit[2]} />;
    } else if (pathSplit[1] === 'profile') {
      if (pathSplit[2] === 'opret') {
        topbar = false;
        currentPage = <CreateProfilePage title="Opret profil" />;
      } else if (pathSplit[2] === 'rediger') {
        topbar = false;
        currentPage = (
          <CreateProfilePage title="Redigér profil" editMode={true} />
        );
      } else if (pathSplit[2] === 'smag') {
        currentPage = <TastePage />;
      } else {
        currentPage = <ProfilePage />;
      }
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
        {topbar ? (
          <div>
            <TopBar dispatch={this.props.dispatch} user={this.props.user} />
            <div style={{height: '50px'}} />
          </div>
        ) : (
          ''
        )}
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
      user: state.userReducer
    };
  }
)(App);
