import React from 'react';
import {connect} from 'react-redux';
import Link from '../general/Link.component';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';
import logo from '../../logo.svg';
import ShortListDropDown from '../list/ShortListDropDown.container';
import ListOverviewDropDown from '../list/ListOverviewDropDown.container';
import ProfileImage from '../general/ProfileImage.component';
import {isMobile} from 'react-device-detect';
import Icon from '../base/Icon';

import './Topbar.css';

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
        <li className="hide-on-m-and-up">
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
    this.state = {dropdownActive: false};
  }

  toggleDropdown() {
    let newState = this.state.dropdownActive ? false : true;
    this.setState({dropdownActive: newState});
  }

  closeDropdown = event => {
    // Dont dubble close on 'dropdown' click
    let abortCloseDropdown = false;
    const path = event.path || (event.composedPath && event.composedPath());

    path.forEach(el => {
      if (el.className && el.className.includes('abort-closeDopdown')) {
        abortCloseDropdown = true;
      }
    });

    // close dropdown on click on every other element than 'dropdown' or 'wrapperRef'
    if (!abortCloseDropdown) {
      this.setState({dropdownActive: false});
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.closeDropdown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdown);
  }

  renderShortListBtn() {
    const {expanded} = this.props.shortListState;

    return isMobile ? (
      <Link href="/huskeliste" className="Topbar__navigation__btn">
        <Icon name="bookmark_border" />
      </Link>
    ) : (
      <ShortListDropDown
        className={
          'Topbar__navigation__btn ' +
          (expanded ? 'Topbar__shortlist_expanded' : '')
        }
      >
        <Icon name="bookmark_border" />
      </ShortListDropDown>
    );
  }
  renderListsOverviewDropdown() {
    const {expanded} = this.props.listsState;
    return isMobile ? (
      <Link href="/profile" className="Topbar__navigation__btn">
        <Icon name="list" />
      </Link>
    ) : (
      <ListOverviewDropDown
        className={
          'Topbar__navigation__btn ' +
          (expanded ? 'Topbar__shortlist_expanded' : '')
        }
      >
        <Icon name="list" />
        Lister
      </ListOverviewDropDown>
    );
  }
  render() {
    const shortlist = this.renderShortListBtn();
    const userLists = this.renderListsOverviewDropdown();
    return (
      <header className="Topbar row">
        <Link href="/" className="Topbar__logo">
          <h1 className="hide-on-s-and-down">Læsekompasset</h1>
          <img src={logo} className="show-on-s-and-down" alt="Læsekompasset" />
        </Link>
        <nav className="col-xs-12 col-m-8 Topbar__navigation">
          <Link href="/find" className="Topbar__navigation__btn">
            <Icon name="search" />
            <span>Søg</span>
          </Link>

          {shortlist}

          {!this.props.user.isLoggedIn && (
            <Link
              href={'/v1/login'}
              type={HISTORY_PUSH_FORCE_REFRESH}
              className="Topbar__navigation__btn"
            >
              <span>Log ind</span>
            </Link>
          )}

          {this.props.user.isLoggedIn && [
          userLists,
            <span
              className="Topbar__navigation__btn abort-closeDopdown hide-on-s-and-down"
              onClick={() => this.toggleDropdown()}
            >
              <ProfileImage type="top" user={this.props.user} />
            </span>,
            <span
              className="Topbar__navigation__btn abort-closeDopdown show-on-s-and-down"
              onClick={() => this.toggleDropdown()}
            >
              <Icon name="menu" className="Topbar__burger" />
            </span>
          ]}
          <div className="Topbar__overlay" />
        </nav>
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
    listsState: state.listReducer
  };
};
export const mapDispatchToProps = dispatch => ({
  historyPush: (type, path) => dispatch({type, path}),
  logout: () => dispatch({type: ON_LOGOUT_REQUEST})
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
