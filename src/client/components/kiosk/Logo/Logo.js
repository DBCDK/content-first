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
  render() {
    const {path} = this.props;
    const src = srcMap[path] ? srcMap[path] : logoDark;

    return <img className="logo" src={src} />;
  }
}

const mapStateToProps = state => {
  return {
    path: state.routerReducer.path
  };
};

export default connect(mapStateToProps)(Logo);
