import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import Link from '../general/Link.component';
import ShortListDropDown from '../list/shortlist/ShortListDropDown.container';
import ListOverviewDropDown from '../list/overview/ListOverviewDropDown.container';
import ProfileImage from '../general/ProfileImage.component';
import Icon from '../base/Icon';
import SearchBar from '../filter/SearchBar.component';
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
import {FETCH_STATS} from '../../redux/stats.reducer';

let searchPage = false;

class TopBarDropdown extends React.Component {
  render() {
    const state = this.props.active ? '' : 'Topbar__dropdown__hidden';

    return (
      <ul className={'Topbar__dropdown abort-closeDopdown ' + state}>
        <div className="Topbar__dropdown__caret" />
        <li>
          <Link href="/profile" onClick={this.props.onClick}>
            <span>
              <T component="profile" name="profilePage" />
            </span>
          </Link>
        </li>
        <li className="d-block d-sm-none">
          <Link href="/profile" onClick={this.props.onClick}>
            <span>
              <T component="list" name="listButton" />
            </span>
          </Link>
        </li>
        <li className="divider" />
        <li
          onClick={() => {
            this.props.logout();
            this.props.onClick();
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
  constructor(props) {
    super(props);
    this.state = {
      dropdownActive: false,
      searchExpanded: false,
      width: 0
    };
  }

  componentDidMount() {
    if (this.Topbar) {
      this.Topbar.addEventListener('mousedown', this.closeDropdown);
    }
    window.addEventListener('resize', this.onResize);
    this.calcWidth();

    searchPage = this.props.router.path === '/find' ? true : false;
    this.setState({searchExpanded: searchPage});
    this.props.fetchStats();
  }

  componentWillUnmount() {
    if (this.Topbar) {
      this.Topbar.removeEventListener('mousedown', this.closeDropdown);
    }
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    searchPage = nextProps.router.path === '/find' ? true : false;
    this.setState({searchExpanded: searchPage});
  }

  onResize = () => {
    this.calcWidth();
  };

  toggleDropdown() {
    this.setState({dropdownActive: !this.state.dropdownActive});
    if (this.props.shortListState.expanded) {
      this.props.onShortlistClose();
    }
    if (this.props.listsState.expanded) {
      this.props.onUserListsClose();
    }
  }

  closeDropdown = event => {
    // Dont dubble close on 'dropdown' click
    let abortCloseDropdown = false;
    const path =
      event.path ||
      (event.composedPath && event.composedPath()) ||
      event.target.parentNode;

    /* IE11 & Edge support (no forEach())*/
    for (var i = 0; i < path.length; i++) {
      if (
        path[i].className &&
        path[i].className.includes('abort-closeDopdown')
      ) {
        abortCloseDropdown = true;
      }
    }

    // close dropdown on click on every other element than 'dropdown' or 'wrapperRef'
    if (!abortCloseDropdown) {
      this.setState({dropdownActive: false});
    }
  };

  toggleSearchBar(action = false) {
    const searchBar = document.getElementById('Searchbar__inputfield');
    let status = !this.state.searchExpanded;
    if (action) {
      status = action === 'open' ? true : false;
    }
    if (status && searchBar) {
      searchBar.focus();
    }
    this.props.historyPush(HISTORY_PUSH, '/find');
    this.setState({searchExpanded: status});
  }

  calcWidth() {
    setTimeout(() => {
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
      this.setState({width: res});
    }, 200);
  }

  renderShortListBtn() {
    const {expanded} = this.props.shortListState;
    const listLength = this.props.shortListState.elements.length || 0;

    return (
      <React.Fragment>
        <Link
          href="/huskeliste"
          className="Topbar__navigation__btn d-flex d-md-none widthCalc"
        >
          <Icon name="bookmark_border" />
          <span
            className="short-badge"
            style={{padding: 0, marginLeft: '-9px'}}
          >
            {`(${listLength})`}
          </span>
        </Link>
        <ShortListDropDown
          className={
            'Topbar__navigation__btn d-none d-md-flex widthCalc ' +
            (expanded ? 'Topbar__dropdown_expanded' : '')
          }
          dataCy="topbar-shortlist"
        >
          <Icon name="bookmark_border" />
        </ShortListDropDown>
      </React.Fragment>
    );
  }

  renderListsOverviewDropdown() {
    const {expanded} = this.props.listsState;
    return (
      <ListOverviewDropDown
        className={
          'Topbar__navigation__btn d-none d-sm-flex widthCalc ' +
          (expanded ? 'Topbar__dropdown_expanded' : '')
        }
        dataCy="topbar-lists"
      >
        <Icon name="list" />
        <span>
          <T component="list" name="listButton" />
        </span>
      </ListOverviewDropDown>
    );
  }

  render() {
    const shortlist = this.renderShortListBtn();
    const userLists = this.renderListsOverviewDropdown();
    const searchExpanded = searchPage && this.state.searchExpanded;
    const searchIconText = searchExpanded ? (
      <i className="material-icons  material-icons-cancel">cancel</i>
    ) : (
      <T component="general" name="searchButton" />
    );
    const searchFieldWidth = searchExpanded ? this.state.width : 0;
    const border = searchExpanded ? {borderColor: 'transparent'} : {};

    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const hideOnIE11 = isIE11 && searchExpanded ? 'hidden' : '';

    const isIndex = this.props.router.path === '/' ? true : false;

    const booksCount = this.props.stats.books
      ? this.props.stats.books.total
      : '0';

    return (
      <header className="Topbar row" ref={e => (this.Topbar = e)}>
        {searchPage &&
          searchExpanded && (
            <div className="Topbar__mobile__overlay d-block d-sm-none">
              <span onClick={() => this.toggleSearchBar('close')}>
                <Icon name="chevron_left" />
                <T component="general" name="back" />
              </span>
              <span
                onClick={() => this.props.historyPush(HISTORY_REPLACE, '/find')}
              >
                Nulstil
              </span>
            </div>
          )}

        <nav className="col-12 col-m-8 Topbar__navigation">
          {searchExpanded && (
            <div>
              <div className="Topbar__special widthCalc">
                <img
                  type="image/svg+xml"
                  alt=""
                  src="/img/general/dibliofigur.svg"
                  style={{height: '28px'}}
                />
              </div>
            </div>
          )}
          <span
            className="Topbar__navigation__btn widthCalc d-none d-md-flex"
            style={border}
          >
            <Icon name="search" onClick={() => this.toggleSearchBar('open')} />
            <span className="relative--container">
              <span
                className="Topbar__SearchBarWrapper"
                style={{width: searchFieldWidth}}
                ref={e => (this.SearchBarWrapper = e)}
              >
                <SearchBar />
              </span>
            </span>
            <span
              data-cy="topbar-search-btn"
              onClick={() => this.toggleSearchBar()}
            >
              {searchIconText}
            </span>
          </span>

          <Link
            href="/find"
            className="Topbar__navigation__btn d-i-block d-md-none"
          >
            <Icon name="search" onClick={() => this.toggleSearchBar('open')} />
          </Link>

          {shortlist}

          {!this.props.user.isLoggedIn && (
            <Link
              href={'/v1/auth/login'}
              type={HISTORY_PUSH_FORCE_REFRESH}
              className="Topbar__navigation__btn widthCalc"
              dataCy="topbar-login-btn"
            >
              <span>
                <T component="login" name="loginButton" />
              </span>
            </Link>
          )}
          {this.props.user.isLoggedIn && (
            <React.Fragment>
              {userLists}

              <span
                className="Topbar__navigation__btn widthCalc abort-closeDopdown d-none d-sm-flex"
                onClick={() => this.toggleDropdown()}
              >
                <ProfileImage
                  type="top"
                  user={this.props.user}
                  style={{padding: '0'}}
                />
              </span>
              <span
                className="Topbar__navigation__btn abort-closeDopdown d-flex d-sm-none"
                onClick={() => this.toggleDropdown()}
              >
                <Icon name="menu" className="Topbar__burger" />
              </span>
            </React.Fragment>
          )}
          <div className="Topbar__overlay" />
        </nav>
        <Link href="/" className={`Topbar__logo ${hideOnIE11}`}>
          <div className="d-block d-sm-none d-inline-flex">
            <object
              type="image/svg+xml"
              data="/img/general/dibliofigur.svg"
              style={{
                height: '28px',
                marginTop: '1px',
                marginRight: '7px',
                'pointer-events': 'none'
              }}
            />
            <div>
              <Text
                className="m-0"
                type="large"
                style={{lineHeight: '1.25rem'}}
              >
                Læsekompas
              </Text>
              <Text className="logo-beta-sign mb-0" type="micro">
                BETA
              </Text>
            </div>
          </div>

          <div className="d-none d-sm-block">
            <div className="d-inline-flex">
              <object
                type="image/svg+xml"
                data="/img/general/dibliofigur.svg"
                style={{
                  height: '28px',
                  marginTop: '6px',
                  marginRight: '7px',
                  'pointer-events': 'none'
                }}
              />

              <div>
                <Title className="mb-0" Tag="h1" type="title4">
                  Læsekompas
                </Title>
                <div className="logo-beta-wrap d-flex position-relative">
                  <Text className="logo-beta-sign mb-0" type="micro">
                    BETA
                  </Text>
                  {!searchExpanded &&
                    ((isIndex && isMobileOnly) || !isMobileOnly) && (
                      <div className="d-inline-flex">
                        <div className="d-none d-sm-inline logo-beta-text Text__small">
                          <T
                            component="topbar"
                            name="betaText"
                            vars={[booksCount]}
                          />
                          <Text
                            className="d-inline logo-beta-link mb0"
                            type="small"
                            variant="decoration-underline"
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              this.props.betaModal();
                            }}
                          >
                            <T component="general" name="readMore" />
                          </Text>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <TopBarDropdown
          logout={this.props.logout}
          active={this.state.dropdownActive}
          onClick={() => this.setState({dropdownActive: false})}
        />
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer,
    listsState: state.listReducer,
    router: state.routerReducer,
    stats: state.stats
  };
};
export const mapDispatchToProps = dispatch => ({
  historyPush: (type, path) => dispatch({type, path}),
  logout: () => dispatch({type: ON_LOGOUT_REQUEST}),
  onUserListsClose: () => dispatch({type: ON_USERLISTS_COLLAPSE}),
  onShortlistClose: () => dispatch({type: ON_SHORTLIST_COLLAPSE}),
  fetchStats: () => dispatch({type: FETCH_STATS}),
  betaModal: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: <T component="topbar" name="betaModalTitle" />,
        reason: (
          <React.Fragment>
            <Text type="body" variant="weight-semibold">
              <T component="topbar" name="betaModalDescription" />
            </Text>
            <Text type="body">
              <T component="topbar" name="betaModalBody1" />
              <Text
                className="d-inline"
                type="body"
                variant="color-fersken--weight-semibold--transform-uppercase"
              >
                {' betatest'}
              </Text>
              {'. '}
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);
