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
import Title from '../base/Title/index';
import Text from '../base/Text/index';
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
            <span>Min profil</span>
          </Link>
        </li>
        <li className="d-block d-sm-none">
          <Link href="/profile" onClick={this.props.onClick}>
            <span>Lister</span>
          </Link>
        </li>
        <li className="divider" />
        <li
          onClick={() => {
            this.props.logout();
            this.props.onClick();
          }}
        >
          <span>Log ud</span>
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
        <span>Lister</span>
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
      'Søg'
    );
    const searchFieldWidth = searchExpanded ? this.state.width : 0;
    const border = searchExpanded ? {borderColor: 'transparent'} : {};

    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const hideOnIE11 = isIE11 && searchExpanded ? 'hidden' : '';

    const isIndex = this.props.router.path === '/' ? true : false;

    return (
      <header className="Topbar row" ref={e => (this.Topbar = e)}>
        {searchPage &&
          searchExpanded && (
            <div className="Topbar__mobile__overlay d-block d-sm-none">
              <span onClick={() => this.toggleSearchBar('close')}>
                <Icon name="chevron_left" /> Tilbage
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
            <div className="Topbar__special">
              <Link href="/">
                <div className="Topbar__navigation__btn Topbar__icon">
                  <img
                    type="image/svg+xml"
                    src="img/general/dibliofigur.svg"
                    style={{width: '25px', height: '30px'}}
                  />
                </div>
              </Link>
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
              <span>Log ind</span>
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
              data="img/general/dibliofigur.svg"
              style={{width: '20px', height: '25px', margin: '3px'}}
            />
            <div>
              <Text className="m-0" type="large">
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
                data="img/general/dibliofigur.svg"
                style={{width: '20px', height: '25px', margin: '6px'}}
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
                        <Text
                          className="d-none d-sm-inline logo-beta-text"
                          type="small"
                        >
                          {this.props.stats.books &&
                            `Nu ${this.props.stats.books.total} ` +
                              (this.props.stats.books.total === 1
                                ? 'bog. '
                                : 'bøger. ')}
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
                            {'Læs mere'}
                          </Text>
                        </Text>
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
        title: 'Om Læsekompas.dk',
        reason: (
          <React.Fragment>
            <Text type="body" variant="weight-semibold">
              {
                'Læsekompasset er skabt for at gøre det nemt for dig at opdage bøger, der passer til dig, og inspirere dig til nye læseoplevelser.'
              }
            </Text>
            <Text type="body">
              {
                'Vi arbejder hele tiden på at forbedre Læsekompasset og øge antallet af bøger. Lige nu er vi i '
              }
              <Text
                className="d-inline"
                type="body"
                variant="color-fersken--weight-semibold--transform-uppercase"
              >
                betatest
              </Text>
              {
                /* eslint-disable */
                '. Det betyder, at du frit kan bruge webstedet, men at du sagtens kan opleve ting, der ikke fungerer optimalt endnu, og at mængden af bøger lige nu er begrænset. I løbet af de kommende måneder kommer alle de vigtigste nye udgivelser med, og der vil også med tiden komme flere ældre bøger med. Læsekompasset har skønlitteratur til voksne, men fagbøger og børnebøger kan du ikke finde her.\r\n \r\nVi vil blive meget glade for din feedback, som du kan give os via feedback-knappen nederst på siden. Din feedback hjælper os med at gøre Læsekompasset bedre.'
                /* eslint-enable */
              }
            </Text>
          </React.Fragment>
        ),
        confirmText: 'Luk',
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
