import React from 'react';
import Cookies from 'js-cookie';
import './CookieWarning.css';
import Button from '../../base/Button';
import Text from '../../base/Text';
import Title from '../../base/Title';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {connect} from 'react-redux';

class CookieWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false,
      displayWarning:
        typeof window !== 'undefined'
          ? !Cookies.get('did-accept-cookies')
          : false,
      slideOutAnimation: false
    };
  }

  componentDidMount() {
    this.setState({isClient: true});
  }

  onClose() {
    this.setState({slideOutAnimation: true});
    Cookies.set('did-accept-cookies', ' ', {expires: 365});
    setTimeout(() => {
      this.setState({displayWarning: false});
    }, 1000);
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
                Cookies på Læsekompas
              </Title>
              <Text type="body" className="cookie-warning-body">
                Vi bruger cookies for at kunne give dig en bedre
                brugeroplevelse. Når du klikker videre på siden, accepterer du
                dette.
                <br />
                Læs mere i&nbsp;
                <span
                  onClick={e => {
                    e.preventDefault();
                    this.props.goToPolicyPage();
                  }}
                >
                  vores privatlivspolitik.
                </span>
              </Text>
            </div>

            <div className="cookie-warning-button-container">
              <Button
                variant="bgcolor-petroleum--color-white"
                size="medium"
                onClick={this.onClose.bind(this)}
              >
                ACCEPTER COOKIES
              </Button>
            </div>
          </div>
        </div>
      )
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  goToPolicyPage: () => dispatch({type: HISTORY_REPLACE, path: '/om'})
});
export default connect(null, mapDispatchToProps)(CookieWarning);
