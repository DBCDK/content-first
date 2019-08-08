import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Head from './components/base/Head';
import Modal from './components/modals/Modal.container';
import FrontPage from './components/frontpage/FrontPage.container';
import FilterPage from './components/filter/FilterPage/FilterPage.container';
import WorkPage from './components/work/WorkPage/WorkPage.container';
import EditProfilePage from './components/profile/EditProfilePage';
import TopBar from './components/top/TopBar.component';
import {ON_USER_DETAILS_REQUEST} from './redux/user.reducer';
import ListPage from './components/list/ListPage';
import ShortList from './components/list/shortlist/ShortList.container';
import Spinner from './components/general/Spinner/Spinner.component';
import Styleguide from './components/Styleguide/Styleguide.component';
import FeedbackButton from './components/general/FeedbackButton/FeedbackButton.component';
import Footer from './components/general/Footer/Footer.component';
import Article from './components/article/Article.component';
import Animate from './components/base/Animate';
import CookieWarning from './components/general/CookieWarning/CookieWarning';
import BeltEditor from './components/editor/BeltEditor.component';
import PrintLayout from './components/list/printLayout/PrintLayout';
import {OPEN_MODAL} from './redux/modal.reducer';

import './style/App.css';
import './style/index.css';

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

    const backgroundColor =
      pathSplit && pathSplit[1] === 'styleguide'
        ? 'var(--lys-graa)'
        : 'var(--white)';

    let currentPage = null;
    let topbar = true;
    let footer = true;
    let feedBack = true;
    if (pathSplit[1] === '') {
      currentPage = <FrontPage />;
    } else if (pathSplit[1] === 'værk') {
      currentPage = <WorkPage pid={pathSplit[2]} />;
    } else if (pathSplit[1] === 'profil') {
      if (pathSplit[2] === 'rediger') {
        currentPage = <EditProfilePage />;
      }
    } else if (pathSplit[1] === 'lister') {
      if (pathSplit[2]) {
        currentPage = <ListPage id={pathSplit[2]} />;
      }
    } else if (pathSplit[1] === 'huskeliste') {
      currentPage = <ShortList />;
    } else if (pathSplit[1] === 'find') {
      currentPage = <FilterPage />;
    } else if (pathSplit[1] === 'replay') {
      currentPage = (
        <Spinner
          className="d-block mx-auto"
          style={{marginTop: 200}}
          size="50px"
        />
      );
    } else if (pathSplit[1] === 'redaktionen') {
      currentPage = <BeltEditor />;
    } else if (pathSplit[1] === 'styleguide') {
      currentPage = <Styleguide />;
      footer = false;
    } else if (pathSplit[1] === 'print' && pathSplit[2]) {
      currentPage = <PrintLayout id={pathSplit[2]} />;
      topbar = false;
      footer = false;
      feedBack = false;
    }

    if (!currentPage) {
      currentPage = <Article path={`/${pathSplit[1]}`} />;
    }

    return (
      <div className={'App'} style={{backgroundColor}}>
        <Head />
        {topbar && (
          <div>
            <TopBar dispatch={this.props.dispatch} user={this.props.user} />
            <div className="App__TopbarPlaceholder" />
          </div>
        )}
        <div id="scrollableArea">{currentPage}</div>
        <Modal />
        <CookieWarning />
        <Animate />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover={false}
          delay={5000}
        />

        {feedBack && <FeedbackButton />}
        {footer && <Footer />}
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
        },
        onCancel: () => {
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
