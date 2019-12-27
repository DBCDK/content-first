import React from 'react';
import {connect} from 'react-redux';

import './Logo.css';

import logoDark from './LaesekompasLogo--dark.svg';
import logoLight from './LaesekompasLogo--light.svg';

const srcMap = {
  '/': logoLight,
  '/kiosk': logoLight
};

class Logo extends React.Component {
  constructor(props) {
    super(props);

    this.timeoutInMiliseconds = 5000;
    this.init();
  }

  init() {
    this.count = 0;
    this.timeoutId = false;
  }

  startTimer = () => {
    this.timeoutId = window.setTimeout(
      this.onTimeout,
      this.timeoutInMiliseconds
    );
  };

  onTimeout = () => {
    this.resetTimer();
  };

  resetTimer = () => {
    window.clearTimeout(this.timeoutId);
    this.init();
  };

  clickGesture() {
    if (!this.timeoutId) {
      this.startTimer();
    }

    this.count++;

    if (this.count === 10) {
      this.resetTimer();
      window.location.href = '/kiosk';
    }
  }

  render() {
    const {path} = this.props;
    const src = srcMap[path] ? srcMap[path] : logoDark;

    return (
      <img className="logo" src={src} onClick={() => this.clickGesture()} />
    );
  }
}

const mapStateToProps = state => {
  return {
    path: state.routerReducer.path
  };
};

export default connect(mapStateToProps)(Logo);
