import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {loadKiosk} from '../../../redux/kiosk.thunk';

const KIOSK_SETTINGS_PATH = '/kiosk';

class Kiosk extends React.Component {
  constructor(props) {
    super(props);
  }

  start = () => {
    this.props.history(HISTORY_REPLACE, '/');
  };

  isConfigured = () => {
    return (
      this.props.kiosk &&
      this.props.kiosk.branchKey &&
      this.props.kiosk.configuration &&
      this.props.kiosk.configuration.agencyId &&
      this.props.kiosk.configuration.branch &&
      !this.props.kiosk.error
    );
  };

  configureIfNeeded = () => {
    const {enabled, loaded} = this.props.kiosk;
    if (
      this.props.kiosk.enabled &&
      !this.props.kiosk.isLoading &&
      !this.props.kiosk.loaded
    ) {
      this.props.loadKiosk({
        branchKey: this.props.urlParams.kiosk && this.props.urlParams.kiosk[0]
      });
    }

    const path = this.props.path;
    if (
      !enabled ||
      !loaded ||
      this.isConfigured() ||
      path === KIOSK_SETTINGS_PATH
    ) {
      return;
    }

    // KIOSK mode has not been configured, redirect to settings page
    this.props.history(HISTORY_REPLACE, KIOSK_SETTINGS_PATH);
  };

  componentDidMount() {
    this.configureIfNeeded();
  }

  componentDidUpdate() {
    this.configureIfNeeded();
  }

  render() {
    const {render} = this.props;
    return render({
      kiosk: this.props.kiosk,
      configured: this.isConfigured(),
      start: this.start,
      loadKiosk: this.props.loadKiosk
    });
  }
}

const mapStateToProps = state => {
  return {
    kiosk: state.kiosk,
    path: state.routerReducer && state.routerReducer.path,
    urlParams: state.routerReducer.params
  };
};
const mapDispatchToProps = dispatch => ({
  history: (type, path) => dispatch({type, path}),
  loadKiosk: params => dispatch(loadKiosk(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kiosk);
