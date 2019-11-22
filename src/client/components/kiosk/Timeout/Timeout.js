import React from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {SHORTLIST_CLEAR} from '../../../redux/shortlist.reducer';

export class Timeout extends React.Component {
  constructor(props) {
    super(props);

    // props.miliseconds (is false if disabled)
    this.timeoutInMiliseconds = false;
    this.timeoutId = false;
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const timeoutBefore = get(prevProps, 'kiosk.configuration.timeout');
    const timeoutNow = get(this.props, 'kiosk.configuration.timeout');

    if (timeoutNow !== timeoutBefore) {
      // Update timeout
      this.timeoutInMiliseconds = this.props.kiosk.configuration.timeout;
      //  rerun initil
      this.init();
    }
  }

  init() {
    if (this.timeoutInMiliseconds) {
      this.setListeners();
      this.startTimer();
    }
  }

  setListeners = () => {
    document.addEventListener('mousemove', this.resetTimer, false);
    document.addEventListener('mousedown', this.resetTimer, false);
    document.addEventListener('keypress', this.resetTimer, false);
    document.addEventListener('touchmove', this.resetTimer, false);
  };

  startTimer = () => {
    this.timeoutId = window.setTimeout(
      this.onTimeout,
      this.timeoutInMiliseconds
    );
  };

  onTimeout = () => {
    const {clearShortlist, router} = this.props;
    // Clears shortlist
    clearShortlist();
    // Reset to index + clear History
    if (router.pos > 0 || router.path !== '/') {
      window.location.replace('/');
    }
  };

  resetTimer = () => {
    window.clearTimeout(this.timeoutId);
    this.startTimer();
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {router: state.routerReducer, kiosk: state.kiosk};
};

export const mapDispatchToProps = dispatch => {
  return {
    clearShortlist: () =>
      dispatch({
        type: SHORTLIST_CLEAR
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeout);
