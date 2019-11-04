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

  render() {
    const {shortListState, router} = this.props;

    const onHome = router.path === '/' ? 'underline' : '';
    const onFind = router.path === '/find' ? 'underline' : '';
    const onShort = router.path === '/huskeliste' ? 'underline' : '';

    const shortlistVal = shortListState.elements.length || 0;

    return (
      <div className="navigation">
        <div className="navigation-actions">
          <div className="actions actions--left">
            <div className="action--btn" onClick={this.browserBack}>
              <Icon name="chevron_left" />
            </div>
            <div className="action--btn" onClick={this.browserForward}>
              <Icon name="chevron_right" />
            </div>
          </div>
          <div className="actions actions--right">
            <Link href="/" className={`action--btn ${onHome}`}>
              <span className="content--center">
                <Icon name="home" />
                <Title type="title5">
                  <T component="general" name="home" />
                </Title>
              </span>
            </Link>

            <Link href="/find" className={`action--btn ${onFind}`}>
              <span className="content--center">
                <Icon name="search" />
                <Title type="title5">
                  <T component="general" name="searchButton" />
                </Title>
              </span>
            </Link>

            <Link href="/huskeliste" className={`action--btn ${onShort}`}>
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
          <img src="/static/media/LaesekompasLogo.9c5e645e.svg" />
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

export const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
