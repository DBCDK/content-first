import React from 'react';
import {connect} from 'react-redux';
import Link from '../general/Link.component';
import ShortListDropDown from '../list/ShortListDropDown.container';
import ListOverviewDropDown from '../list/ListOverviewDropDown.container';
import ProfileImage from '../general/ProfileImage.component';
import Icon from '../base/Icon';
import SearchBar from '../filter/SearchBar.component';
import {HISTORY_PUSH, HISTORY_REPLACE} from '../../redux/middleware';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';
import {ON_USERLISTS_COLLAPSE} from '../../redux/list.reducer';
import {ON_SHORTLIST_COLLAPSE} from '../../redux/shortlist.reducer';

import logo from '../../logo.svg';
import './Topbar.css';

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
    document.addEventListener('mousedown', this.closeDropdown);
    window.addEventListener('resize', this.onResize);
    this.calcWidth();

    searchPage = this.props.router.path === '/find' ? true : false;
    this.setState({searchExpanded: searchPage});
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdown);
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
    let status = !this.state.searchExpanded;
    if (action) {
      status = action === 'open' ? true : false;
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

    return (
      <React.Fragment>
        <Link
          href="/huskeliste"
          className="Topbar__navigation__btn d-flex d-md-none widthCalc"
        >
          <Icon name="bookmark_border" />
        </Link>
        <ShortListDropDown
          className={
            'Topbar__navigation__btn d-none d-md-flex widthCalc ' +
            (expanded ? 'Topbar__dropdown_expanded' : '')
          }
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
    const searchIconText = searchExpanded ? 'Luk' : 'Søg';
    const searchFieldWidth = searchExpanded ? this.state.width : 0;
    const border = searchExpanded ? {borderColor: 'transparent'} : {};

    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const hideOnIE11 = isIE11 && searchExpanded ? 'hidden' : '';

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
            <span onClick={() => this.toggleSearchBar()}>{searchIconText}</span>
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
              href={'/v1/login'}
              type={HISTORY_PUSH_FORCE_REFRESH}
              className="Topbar__navigation__btn widthCalc"
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
          <h1 className="d-none d-sm-inline">Læsekompasset</h1>
          <img src={logo} className="d-block d-sm-none" alt="Læsekompasset" />
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
    router: state.routerReducer
  };
};
export const mapDispatchToProps = dispatch => ({
  historyPush: (type, path) => dispatch({type, path}),
  logout: () => dispatch({type: ON_LOGOUT_REQUEST}),
  onUserListsClose: () => dispatch({type: ON_USERLISTS_COLLAPSE}),
  onShortlistClose: () => dispatch({type: ON_SHORTLIST_COLLAPSE})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);
