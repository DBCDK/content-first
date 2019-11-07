import React from 'react';
import {connect} from 'react-redux';

import Link from '../../general/Link.component';

import Title from '../../base/Title';
import Icon from '../../base/Icon';
import T from '../../base/T/';

import './Navigation.css';

export class Navigation extends React.Component {
  browserForward = () => {
    window.history.forward();
  };

  browserBack = () => {
    window.history.back();
  };

  focusSearch = () => {
    const input = document.getElementById('Searchbar__inputfield');
    if (input) {
      input.focus();
    }
  };

  render() {
    const {shortListState, router} = this.props;

    const onHome = router.path === '/' ? 'underline' : '';
    const onFind = router.path === '/find' ? 'underline' : '';
    const onShort = router.path === '/huskeliste' ? 'underline' : '';

    const shortlistVal = shortListState.elements.length || 0;

    const history = window.history;

    let backActiveClass = '';
    let forwardActiveClass = '';

    if (history.state && history.state.state && history.state.state.pos > 1) {
      backActiveClass = 'active';
    }

    if (
      (!history.state && history.length > 1) ||
      (history.state &&
        history.state.state &&
        history.state.state.pos < history.length)
    ) {
      forwardActiveClass = 'active';
    }

    return (
      <div className="navigation">
        <div className="navigation-actions">
          <div className="actions actions--left">
            <div
              className={`action--btn wave ${backActiveClass}`}
              data-cy="navBrowserBack"
              onClick={this.browserBack}
            >
              <Icon name="chevron_left" />
            </div>
            <div
              className={`action--btn wave ${forwardActiveClass}`}
              data-cy="navBrowserForward"
              onClick={this.browserForward}
            >
              <Icon name="chevron_right" />
            </div>
          </div>
          <div className="actions actions--right">
            <Link
              href="/"
              data-cy="navActionHome"
              className={`action--btn wave ${onHome}`}
            >
              <span className="content--center">
                <Icon name="home" />
                <Title type="title5">
                  <T component="general" name="home" />
                </Title>
              </span>
            </Link>

            <Link
              href="/find"
              data-cy="navActionFind"
              className={`action--btn wave ${onFind}`}
              onClick={() => this.focusSearch()}
            >
              <span className="content--center">
                <Icon name="search" />
                <Title type="title5">
                  <T component="general" name="searchButton" />
                </Title>
              </span>
            </Link>

            <Link
              href="/huskeliste"
              data-cy="navActionShort"
              className={`action--btn wave ${onShort}`}
            >
              <span className="content--center">
                <span className="shortlist__icon-value--wrap">
                  <Icon name="bookmark_border" />
                  <Title type="title5" Tag="h5" className="shortlist__value">
                    {`(${shortlistVal})`}
                  </Title>
                </span>
                <Title type="title5">
                  <T component="shortlist" name="buttonLabel" />
                </Title>
              </span>
            </Link>
          </div>
        </div>
        <div className="navigation__logo--wrap">
          <img
            src="/static/media/LaesekompasLogo.9c5e645e.svg"
            alt="navigation"
          />
        </div>
      </div>
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

export const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
