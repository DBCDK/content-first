import React from 'react';
import {connect} from 'react-redux';
import Link from '../general/Link.component';
import {HISTORY_PUSH, HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {ON_LOGOUT_REQUEST} from '../../redux/user.reducer';
import logo from '../../logo.svg';
import ShortListDropDown from '../list/ShortListDropDown.container';
import ProfileImage from '../general/ProfileImage.component';

import Icon from '../base/Icon';
import User from '../base/Skeleton/User';

import './Topbar.css';

class TopBarDropdown extends React.Component {
  render() {
    const state = this.props.active ? '' : 'Topbar__dropdown__hidden';

    return (
      <ul className={'Topbar__dropdown ' + state}>
        <div className="Topbar__dropdown__caret" />
        <li>
          <Link href="/profile">
            <span>Min profil</span>
          </Link>
        </li>
        <li>
          <span>Menupunkt 2</span>
        </li>
        <li className="divider" />
        <li onClick={() => this.props.logout()}>
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

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropdown() {
    let newState = this.state.dropdownActive ? false : true;
    this.setState({dropdownActive: newState});
  }

  closeDropdown(event) {
    if (
      this.state.dropdownActive &&
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target)
    ) {
      setTimeout(() => {
        this.setState({dropdownActive: false});
      }, 150);
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeDropdown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdown);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    return (
      <header className="Topbar row">
        <div className="col-xs-4 Topbar__logo">
          <h1 onClick={() => this.props.historyPush(HISTORY_PUSH, '/')}>
            Læsekompasset
          </h1>
        </div>
        <nav className="col-xs-8 Topbar__navigation">
          <Link href="/find" className="Topbar__navigation__btn">
            <Icon name="search" />
            <span>Søg</span>
          </Link>

          <ShortListDropDown className={'Topbar__navigation__btn'}>
            <Icon name="bookmark" />
          </ShortListDropDown>

          <Link href="/profile" className="Topbar__navigation__btn">
            <Icon name="list" />
            <span>Lister</span>
          </Link>
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
            <span
              className="Topbar__navigation__btn"
              onClick={() => this.toggleDropdown()}
              ref={this.setWrapperRef}
            >
              <ProfileImage type="top" user={this.props.user} />
            </span>,
            <TopBarDropdown
              logout={this.props.logout}
              active={this.state.dropdownActive}
            />
          ]}
        </nav>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
export const mapDispatchToProps = dispatch => ({
  historyPush: (type, path) => dispatch({type, path}),
  logout: () => dispatch({type: ON_LOGOUT_REQUEST})
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);

// function TopBar(props) {
//   // eslint-disable-line no-unused-vars
//   return (
//     <div className="row topbar container">
//       <div
//         className="col-xs-6 text-left header"
//         onClick={() => {
//           props.dispatch({type: HISTORY_PUSH, path: '/'});
//         }}
//       >
//         <div>
//           <img src={logo} alt="logo" />
//         </div>
//         <div>
//           <h1>Læsekompasset</h1>
//         </div>
//       </div>
//       <div className="col-xs-6 text-right login">
//         <div className="inline">
//           <Link href="/find">
//             <i className="glyphicon glyphicon-search icon" />
//           </Link>
//         </div>
//         <ShortListDropDown />
//         {!props.user.isLoggedIn && (
//           <span
//             onClick={() => {
//               props.dispatch({
//                 type: HISTORY_PUSH_FORCE_REFRESH,
//                 path: '/v1/login'
//               });
//             }}
//           >
//             Log ind
//           </span>
//         )}
//         {props.user.isLoggedIn && (
//           <div className="inline">
//             <Link href="/profile">
//               <ProfileImage type="top" user={props.user} />
//             </Link>
//             <span
//               className="topbar-logout ml2"
//               onClick={() => {
//                 props.dispatch({type: ON_LOGOUT_REQUEST});
//               }}
//             >
//               Log ud
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
