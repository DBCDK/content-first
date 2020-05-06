import React from 'react';
import Cookies from 'js-cookie';
import './CookieWarning.css';
import Button from '../../base/Button';
import Text from '../../base/Text';
import Title from '../../base/Title';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {connect} from 'react-redux';
import T from '../../base/T';

class CookieWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false,
      displayWarning:
        typeof window !== 'undefined'
          ? Cookies.get('did-accept-cookies') === 'unknown'
          : false,
      slideOutAnimation: false
    };
  }

  componentDidMount() {
    if (!Cookies.get('did-accept-cookies')) {
      Cookies.set('did-accept-cookies', 'unknown');
      this.setState({displayWarning: true});
    }

    this.setState({isClient: true});
  }

  onReject() {
    this.setState({slideOutAnimation: true});

    Cookies.set('did-accept-cookies', 'rejected', {expires: 365});
    setTimeout(() => {
      this.setState({displayWarning: false});
    }, 1000);
  }

  onAccept() {
    this.setState({slideOutAnimation: true});
    Cookies.set('did-accept-cookies', 'accepted', {expires: 365});
    setTimeout(() => {
      this.setState({displayWarning: false});
    }, 1000);
    window.location.reload();
  }

  render() {
    return (
      this.state.displayWarning &&
      this.state.isClient && (
        <div
          className={
            ' cookie-warning-container row ' +
            (this.state.slideOutAnimation ? 'off' : '')
          }
        >
          <div className="cookie-warning-content-container">
            <div className="cookie-warning-text-container">
              <Title Tag="h5" type="title5">
                <T component="general" name="cookieTitleText" />
              </Title>
              <Text type="body" className="cookie-warning-body">
                <T component="general" name="cookieText1" />
              </Text>
            </div>

            <div className="cookie-warning-button-link-container">
              <div className="cookie-warning-link-container">
                <span
                  onClick={e => {
                    e.preventDefault();
                    this.props.goToPrivacyPage();
                  }}
                >
                  <T component="general" name="cookieLink" />
                </span>
              </div>
              <div className="cookie-warning-button-container">
                <Button
                  variant="bgcolor-petroleum--color-white"
                  size="medium"
                  onClick={this.onReject.bind(this)}
                  data-cy="cookie-reject-button"
                >
                  <T component="general" name="cookieRejectBtn" />
                </Button>

                <Button
                  variant="bgcolor-petroleum--color-white"
                  size="medium"
                  onClick={this.onAccept.bind(this)}
                  data-cy="cookie-accept-button"
                >
                  <T component="general" name="cookieAcceptBtn" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  goToPrivacyPage: () =>
    dispatch({type: HISTORY_REPLACE, path: '/privatlivspolitik'})
});
export default connect(
  null,
  mapDispatchToProps
)(CookieWarning);
