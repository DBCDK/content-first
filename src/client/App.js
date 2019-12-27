import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {isMobile} from 'react-device-detect';

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
import BeltEditor from './components/belteditor/BeltEditor.component';
import BeltForm from './components/belteditor/BeltForm.component';
import PrintLayout from './components/list/printLayout/PrintLayout';

// kiosk
import KioskSetup from './components/kiosk/Setup/KioskSetup.component';
import Navigation from './components/kiosk/Navigation/Navigation.component';
import Kiosk from './components/base/Kiosk/Kiosk';
import KioskWorkPage from './components/kiosk/WorkPage/KioskWorkPage.component';
import Logo from './components/kiosk/Logo/Logo';
import Timeout from './components/kiosk/Timeout/Timeout';

import {OPEN_MODAL} from './redux/modal.reducer';

import './style/App.css';
import './style/index.css';
import {ADMIN_ROLE, EDITOR_ROLE} from './components/roles/Role.component';
import Role from './components/roles/Role.component';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {didShowCookieModal: false};
  }

  componentDidMount() {
    this.props.userDetailsRequest();
    this.screenHeight = window.innerHeight;
    this.offset = this.screenHeight / 6;

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const softKeyboard =
      window.innerHeight < this.screenHeight - this.offset ? true : false;
    if (softKeyboard !== this.state.softKeyboard) {
      this.setState({softKeyboard});
    }
  };

  render() {
    if (!navigator.cookieEnabled && !this.state.didShowCookieModal) {
      this.props.cookieModal();
      this.setState({didShowCookieModal: true});
    }

    const isTouchClass = isMobile ? 'isTouch' : '';
    const isPremiumClass = this.props.isPremium ? 'premium' : '';
    const isKioskClass = this.props.isKiosk ? 'kioskmode' : '';
    const softKeyboardClass =
      this.props.isKiosk && this.state.softKeyboard ? 'keyboard' : '';

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
      if (this.props.isKiosk) {
        currentPage = <KioskWorkPage pid={pathSplit[2]} />;
      } else {
        currentPage = <WorkPage pid={pathSplit[2]} />;
      }
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
      if (pathSplit[2] === 'opret') {
        currentPage = (
          <Role
            requiredRoles={[ADMIN_ROLE, EDITOR_ROLE]}
            onAccessDenied={
              <Article path={`/${pathSplit[1]}/${pathSplit[2]}`} />
            }
          >
            <BeltForm mode="create" />
          </Role>
        );
      } else if (pathSplit[2] === 'rediger') {
        currentPage = (
          <Role
            requiredRoles={[ADMIN_ROLE, EDITOR_ROLE]}
            onAccessDenied={
              <Article path={`/${pathSplit[1]}/${pathSplit[2]}`} />
            }
          >
            <BeltForm
              mode="edit"
              {...this.beltFormParams(this.props.routerState.params)}
            />
          </Role>
        );
      } else {
        currentPage = (
          <Role
            requiredRoles={[ADMIN_ROLE, EDITOR_ROLE]}
            onAccessDenied={<Article path={`/${pathSplit[1]}`} />}
          >
            <BeltEditor query={{type: 'belt', owner: EDITOR_ROLE}} />
          </Role>
        );
      }
    } else if (pathSplit[1] === 'styleguide') {
      currentPage = <Styleguide />;
      footer = false;
    } else if (pathSplit[1] === 'print' && pathSplit[2]) {
      currentPage = <PrintLayout id={pathSplit[2]} />;
      topbar = false;
      footer = false;
      feedBack = false;
    } else if (pathSplit[1] === 'kiosk') {
      currentPage = <KioskSetup />;
    }

    if (!currentPage) {
      currentPage = <Article path={`/${pathSplit[1]}`} />;
    }

    return (
      <div
        id="App"
        className={`App ${isKioskClass} ${softKeyboardClass} ${isPremiumClass} ${isTouchClass}`}
        style={{backgroundColor}}
      >
        <Head />

        {this.props.isKiosk && <Timeout />}

        {this.props.isKiosk && <Logo />}

        <Kiosk
          render={({kiosk}) => {
            if (kiosk.enabled) {
              return <Navigation />;
            }
            return (
              topbar && (
                <div>
                  <TopBar
                    dispatch={this.props.dispatch}
                    user={this.props.user}
                  />
                  <div className="App__TopbarPlaceholder" />
                </div>
              )
            );
          }}
        />
        <div id="scrollableArea">{currentPage}</div>
        <Modal />
        {!this.props.isKiosk && <CookieWarning />}
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

        {feedBack && !this.props.isKiosk && <FeedbackButton />}

        <Kiosk
          render={({kiosk}) => {
            if (kiosk.enabled) {
              return <div className="navigation--placeholder" />;
            }
            return footer && <Footer />;
          }}
        />
      </div>
    );
  }

  beltFormParams = params => ({
    title: params.title
      ? Array.isArray(params.title[0])
        ? params.title[0].join()
        : params.title[0]
      : '',
    description: params.description
      ? Array.isArray(params.description[0])
        ? params.description[0].join()
        : params.description[0]
      : '',
    enabled: params.enabled ? params.enabled[0] : false,
    tags: params.tags ? params.tags[0] : [],
    createdBy: params.createdBy ? params.createdBy[0] : '',
    created: params.created ? params.created[0] : '',
    id: params.id ? params.id[0] : '',
    index: params.index ? params.index[0] : ''
  });
}

const mapStateToProps = state => {
  return {
    routerState: state.routerReducer,
    isKiosk: state.kiosk.enabled,
    user: state.userReducer,
    isPremium: state.userReducer.isPremium
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
