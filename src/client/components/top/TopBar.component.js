import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import Link from '../general/Link.component';
import ShortListDropDown from '../list/shortlist/ShortListDropDown.container';
import ListOverviewDropDown from '../list/overview/ListOverviewDropDown.container';
import ProfileImage from '../general/ProfileImage.component';
import Icon from '../base/Icon';
import SearchBar from '../filter/SearchBar/SearchBar.component';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';
import {ON_USERLISTS_COLLAPSE} from '../../redux/list.reducer';
import {ON_SHORTLIST_COLLAPSE} from '../../redux/shortlist.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import Title from '../base/Title/';
import Text from '../base/Text/';
import T from '../base/T/';
import './Topbar.css';
import {eventPath} from '../../utils/path';
import {ADMIN_ROLE, EDITOR_ROLE} from '../roles/Role.component';
import Role from '../roles/Role.component';
import Kiosk from '../base/Kiosk/Kiosk';

let searchPage = false;

class TopBarDropdown extends React.Component {
  render() {
    const {active, listsModal, onClick, logout} = this.props;

    const hiddenClass = active ? '' : 'hidden';
    const isSmallScreen = window.innerWidth < 768;

    return (
      <ul className={`topbar__dropdown dropdown--dont-close ${hiddenClass}`}>
        {isSmallScreen && (
          <li
            onClick={() => {
              listsModal();
              onClick();
            }}
          >
            <span>
              <T component="list" name="myLists" />
            </span>
          </li>
        )}
        <li>
          <Link href="/profil/rediger" onClick={onClick}>
            <span>
              <T component="profile" name="profilePage" />
            </span>
          </Link>
        </li>

        <Role requiredRoles={[ADMIN_ROLE, EDITOR_ROLE]}>
          <li>
            <Link
              href="/redaktionen"
              onClick={onClick}
              data-cy="edit-start-page"
            >
              <span>
                <T component="profile" name="editorialStaff" />
              </span>
            </Link>
          </li>
        </Role>

        <li className="divider" />
        <li
          onClick={() => {
            logout();
            onClick();
          }}
        >
          <span>
            <T component="login" name="logoutButton" />
          </span>
        </li>
      </ul>
    );
  }
}

export class TopBar extends React.Component {
  onResize = () => {
    this.calcWidth();
  };
  closeDropdown = event => {
    // Dont dubble close on 'dropdown' click
    let abortCloseDropdown = false;
    const path = eventPath(event);

    /* IE11 & Edge support (no forEach())*/
    for (var i = 0; i < path.length; i++) {
      if (
        path[i].className &&
        path[i].className.includes('dropdown--dont-close')
      ) {
        abortCloseDropdown = true;
      }
    }

    // close dropdown on click on every other element than 'dropdown' or 'wrapperRef'
    if (!abortCloseDropdown) {
      this.setState({dropdownActive: false});
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      dropdownActive: false,
      searchExpanded: false,
      width: 0,
      showCancel: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeDropdown);
    window.addEventListener('resize', this.onResize);
    this.calcWidth();

    searchPage = this.props.router.path === '/find' ? true : false;
    this.setState({searchExpanded: searchPage});

    const tagsInField = window.location.href.split('=')[1];
    this.setState({showCancel: tagsInField});
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdown);
    this.calcWidth();
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.router.path !== prevProps.router.path) {
      searchPage = this.props.router.path === '/find' ? true : false;
      this.setState({searchExpanded: searchPage});
      this.calcWidth();
    }


  toggleDropdown() {
    this.setState({dropdownActive: !this.state.dropdownActive});
    if (this.props.shortListState.expanded) {
      this.props.onShortlistClose();
    }
    if (this.props.listsState.expanded) {
      this.props.onUserListsClose();
    }
  }

  toggleSearchBar(action = false) {
    let status = !this.state.searchExpanded;
    if (action) {
      status = action === 'open' ? true : false;
    }

    this.props.historyPush(HISTORY_PUSH, '/find');
    this.setState({searchExpanded: status});
  }

  calcWidth() {
    const btns = document.getElementsByClassName('widthCalc');

    const topbar = this.Topbar ? this.Topbar.offsetWidth : 0;

    const searchbarwrapper = this.SearchBarWrapper
      ? this.SearchBarWrapper.offsetWidth
      : 0;

    let width = 0;
    for (var i = 0; i < btns.length; i++) {
      width += btns[i].offsetWidth;
    }

    const res = topbar - (width - searchbarwrapper);

    if (this.state.width !== res) {
      this.setState({width: res});
    }
  }

  renderShortListBtn() {
    const {expanded} = this.props.shortListState;
    const expandedClass = expanded ? 'expanded' : '';
    const listLength = this.props.shortListState.elements.length || 0;

    return (
      <React.Fragment>
        <Link
          href="/huskeliste"
          className="navigation-btn navigation-btn__shortlist--btn widthCalc"
        >
          <Icon name="bookmark_border" />
          <span>{`(${listLength})`}</span>
        </Link>
        <ShortListDropDown
          className={`navigation-btn navigation-btn__shortlist--dropdown widthCalc ${expandedClass}`}
          dataCy="topbar-shortlist"
        >
          <Icon name="bookmark_border" />
        </ShortListDropDown>
      </React.Fragment>
    );
  }

  renderListsOverviewDropdown() {
    const {expanded} = this.props.listsState;
    const expandedClass = expanded ? 'expanded' : '';

    return (
      <ListOverviewDropDown
        className={`navigation-btn navigation-btn__list--dropdown widthCalc ${expandedClass}`}
        dataCy="topbar-lists"
      >
        <Icon name="list" />
        <span>
          <T component="list" name="listButton" />
        </span>
      </ListOverviewDropDown>
    );
  }

  handleIconClick(searchExpanded, showCancelBtn) {
    if (searchExpanded && showCancelBtn) {
      this.props.historyPush(HISTORY_REPLACE, '/find');
      document.getElementById('Searchbar__inputfield').focus();
    } else {
      this.toggleSearchBar();
    }
  }

  render() {
    const shortlist = this.renderShortListBtn();
    const userLists = this.renderListsOverviewDropdown();
    const searchExpanded = searchPage && this.state.searchExpanded;
    const showCancelBtn = window.location.href.split('=')[1];

    const {user, router, betaModal, listsModal, logout} = this.props;

    const cancelVisibleClass = !searchExpanded && !showCancelBtn ? 'hide' : '';

    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const hideOnIE11 = isIE11 && searchExpanded ? 'hidden' : '';
    const collapsedClass = !searchExpanded ? 'collapsed' : '';
    const isIndex = router.path === '/' ? true : false;

    return (
      <header
        id="topbar"
        ref={e => (this.Topbar = e)}
        className={`topbar ${collapsedClass}`}
      >
        <nav className="topbar__navigation">
          <Link href="/" className="widthCalc">
            <div className="topbar__navigation--icon ">
              <img type="image/svg+xml" src="/img/general/dibliofigur.svg" />
            </div>
          </Link>
          <span className="navigation-btn navigation-btn__search--bar widthCalc">
            <Icon name="search" onClick={() => this.toggleSearchBar('open')} />
            <span className="topbar__search-bar--container">
              <span
                className="topbar__search-bar--wrap"
                style={{width: this.state.width}}
                ref={e => (this.SearchBarWrapper = e)}
              >
                <SearchBar origin="fromTopbar" />
              </span>
            </span>
            <span
              className={`searchbar__cancel--btn ${cancelVisibleClass}`}
              data-cy="topbar-search-btn"
              onClick={() =>
                this.handleIconClick(searchExpanded, showCancelBtn)
              }
            >
              {searchExpanded && showCancelBtn && <Icon name="cancel" />}
              {!searchExpanded && <T component="general" name="searchButton" />}
            </span>
          </span>
          {!searchExpanded && (
            <Link
              href="/find"
              className="navigation-btn navigation-btn__search--btn"
            >
              <Icon
                name="search"
                onClick={() => this.toggleSearchBar('open')}
              />
            </Link>
          )}

          {shortlist}

          <Kiosk
            render={({kiosk}) => {
              if (kiosk.enabled || user.isLoggedIn) {
                return null;
              }
              return (
                <Link
                  href={'/v1/auth/login'}
                  type={HISTORY_PUSH_FORCE_REFRESH}
                  className="navigation-btn navigation__login--link widthCalc"
                  dataCy="topbar-login-btn"
                >
                  <span>
                    <T component="login" name="loginButton" />
                  </span>
                </Link>
              );
            }}
          />

          {this.props.user.isLoggedIn && (
            <React.Fragment>
              {userLists}

              <span
                className="navigation-btn navigation-btn__menu--user widthCalc dropdown--dont-close"
                onClick={() => this.toggleDropdown()}
                data-cy="topbar-logged-in-btn"
              >
                <ProfileImage type="top" user={user} />
              </span>
              <span
                className="navigation-btn navigation-btn__menu--burger dropdown--dont-close"
                onClick={() => this.toggleDropdown()}
              >
                <Icon name="menu" />
              </span>
            </React.Fragment>
          )}
          <div className="topbar__overlay" />
        </nav>

        <Link href="/" className={`topbar__logo ${hideOnIE11}`}>
          <object type="image/svg+xml" data="/img/general/dibliofigur.svg" />
          <div>
            <Title
              className="topbar__logo-title"
              Tag="h1"
              type="title4"
              variant="weight-semibold"
            >
              Læsekompas
            </Title>
            <div className="logo-beta-wrap">
              <Text className="logo-beta-sign" type="micro">
                SNEAK PEEK
              </Text>
              {!searchExpanded && ((isIndex && isMobileOnly) || !isMobileOnly) && (
                <Text
                  className="logo-beta-link"
                  type="small"
                  variant="decoration-underline"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    betaModal();
                  }}
                >
                  <T component="general" name="readMore" />
                </Text>
              )}
            </div>
          </div>
        </Link>
        <TopBarDropdown
          logout={logout}
          active={this.state.dropdownActive}
          onClick={() => this.setState({dropdownActive: false})}
          listsModal={listsModal}
        />
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer,
    listsState: state.listReducer,
    router: state.routerReducer
  };
};
export const mapDispatchToProps = dispatch => ({
  historyPush: (type, path) => dispatch({type, path}),
  logout: () => dispatch({type: ON_LOGOUT_REQUEST}),
  onUserListsClose: () => dispatch({type: ON_USERLISTS_COLLAPSE}),
  onShortlistClose: () => dispatch({type: ON_SHORTLIST_COLLAPSE}),
  betaModal: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: <T component="topbar" name="betaModalTitle" />,
        reason: (
          <React.Fragment>
            <Text type="body" variant="weight-semibold">
              <T
                component="topbar"
                name="betaModalDescription"
                renderAsHtml={true}
              />
            </Text>
            <Text type="body">
              <T component="topbar" name="betaModalBody1" renderAsHtml={true} />
              <Text
                className="modal__sneak-peek"
                type="body"
                variant="color-fersken--weight-semibold--transform-uppercase"
              >
                <T component="topbar" name="sneakPeek" />
              </Text>
              <T component="topbar" name="betaModalBody2" />
            </Text>
          </React.Fragment>
        ),
        confirmText: <T component="general" name="close" />,
        hideCancel: true,
        hideConfirm: true,
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
  },
  listsModal: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: <T component="list" name="myLists" />,

        reason: (
          <React.Fragment>
            <ListOverviewDropDown
              className={
                'navigation-btn navigation-btn__dropdown-list--btn widthCalc'
              }
              dataCy="topbar-lists"
              modalView={true}
              expanded={true}
              closeModal={() => {
                dispatch({
                  type: 'CLOSE_MODAL',
                  modal: 'confirm'
                });
              }}
            >
              <Icon name="list" />
              <span>
                <T component="list" name="listButton" />
              </span>
            </ListOverviewDropDown>
          </React.Fragment>
        ),
        confirmText: <T component="general" name="close" />,
        hideCancel: true,
        hideConfirm: true,
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
  mapStateToProps,
  mapDispatchToProps
)(TopBar);
