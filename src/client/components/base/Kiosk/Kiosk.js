import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {storeKiosk, loadKiosk} from '../../../redux/kiosk.thunk';

const KIOSK_SETTINGS_PATH = '/kiosk';

class Kiosk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tmpKiosk: props.kiosk};
  }
  update = kiosk => {
    this.setState({tmpKiosk: {...this.state.tmpKiosk, ...kiosk}});
  };
  store = () => {
    this.props.storeKiosk(this.state.tmpKiosk);
  };
  start = () => {
    this.props.history(HISTORY_REPLACE, '/');
  };

  isConfigured = () => {
    return (
      this.props.kiosk &&
      this.props.kiosk.clientSecret &&
      this.props.kiosk.clientId &&
      !this.props.kiosk.error
    );
  };

  configureIfNeeded = () => {
    const {enabled, loaded} = this.props.kiosk;
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
    if (
      this.props.kiosk.enabled &&
      !this.props.kiosk.isLoading &&
      !this.props.kiosk.loaded
    ) {
      this.props.loadKiosk();
    }
    this.configureIfNeeded();
  }

  componentDidUpdate(prevProps) {
    if (this.props.kiosk !== prevProps.kiosk) {
      this.setState({tmpKiosk: this.props.kiosk});
    }
    this.configureIfNeeded();
  }

  render() {
    const {render} = this.props;
    return render({
      kiosk: this.props.kiosk,
      tmpKiosk: this.state.tmpKiosk,
      update: this.update,
      store: this.store,
      configured: this.isConfigured(),
      start: this.start
    });
  }
}

const mapStateToProps = state => {
  return {
    kiosk: state.kiosk,
    path: state.routerReducer && state.routerReducer.path
  };
};
const mapDispatchToProps = dispatch => ({
  history: (type, path) => dispatch({type, path}),
  storeKiosk: kiosk => dispatch(storeKiosk(kiosk)),
  loadKiosk: () => dispatch(loadKiosk())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kiosk);
