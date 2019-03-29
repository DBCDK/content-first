import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/App.css';
import './style/index.css';
import './style/work.css';
import './style/filterpage.css';
import Modal from './components/modals/Modal.container';
import FrontPage from './components/frontpage/FrontPage.container';
import FilterPage from './components/filter/FilterPage.container';
import WorkPage from './components/work/WorkPage.container';
import TastePage from './components/profile/TastePage.container';
import CreateProfilePage from './components/profile/CreateProfilePage';
import TopBar from './components/top/TopBar.component';
import {ON_USER_DETAILS_REQUEST} from './redux/user.reducer';
import ListPage from './components/list/ListPage';
import ListCreator from './components/list/ListCreatePage';
import Lists from './components/list/overview/Lists.container';
import ShortList from './components/list/shortlist/ShortList.container';
import Spinner from './components/general/Spinner.component';
import Styleguide from './components/Styleguide/Styleguide.component';
import FeedbackButton from './components/general/FeedbackButton.component';
import Footer from './components/general/Footer.component';
import Article from './components/article/Article.component';
import T from './components/base/T';
import Animate from './components/base/Animate';
import {OPEN_MODAL} from './redux/modal.reducer';
import CookieWarning from './components/general/CookieWarning/CookieWarning';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {didShowCookieModal: false};
  }
  componentWillMount() {
    this.props.userDetailsRequest();
  }

  render() {
    if (!navigator.cookieEnabled && !this.state.didShowCookieModal) {
      this.props.cookieModal();
      this.setState({didShowCookieModal: true});
    }

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
        currentPage = (
          <CreateProfilePage
            title={T({component: 'profile', name: 'createProfile'})}
          />
        );
      } else if (pathSplit[2] === 'rediger') {
        topbar = false;
        currentPage = (
          <CreateProfilePage
            title={T({component: 'profile', name: 'editProfile'})}
            editMode={true}
          />
        );
      } else if (pathSplit[2] === 'smag') {
        currentPage = <TastePage />;
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
    } else if (pathSplit[1] === 'find') {
      currentPage = <FilterPage />;
    } else if (pathSplit[1] === 'replay') {
      currentPage = <Spinner size="50px" style={{marginTop: 100}} />;
    } else if (pathSplit[1] === 'styleguide') {
      currentPage = <Styleguide />;
    }

    if (!currentPage) {
      currentPage = <Article path={`/${pathSplit[1]}`} />;
    }

    return (
      <div className="App">
        {topbar ? (
          <div>
            <TopBar dispatch={this.props.dispatch} user={this.props.user} />
            <div className="App__TopbarPlaceholder" />
          </div>
        ) : (
          ''
        )}

        {currentPage}

        <Modal />
        <CookieWarning />
        <Animate />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <FeedbackButton />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    routerState: state.routerReducer,
    user: state.userReducer
  };
};

export const mapDispatchToProps = dispatch => ({
  userDetailsRequest: () => dispatch({type: ON_USER_DETAILS_REQUEST}),
  cookieModal: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: 'COOKIES ER SLÅET FRA',
        reason:
          'Din browser tillader ikke cookies, og det betyder, at dele af Læsekompas.dk ikke vil virke. ' +
          'Vi anbefaler, at du ændrer indstillingen i din browser og tillader cookies, så du kan få den fulde oplevelse og de bedste læseforslag her på siden.',
        confirmText: 'Ok',
        hideCancel: true,
        onConfirm: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  }
});
export default connect(
  // Map redux state to props
  mapStateToProps,
  mapDispatchToProps
)(App);
