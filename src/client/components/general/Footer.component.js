import React from 'react';
import Text from '../base/Text';
import Link from '../general/Link.component';

import LaesekompasLogo from '../svg/LaesekompasLogo.svg';

import './Footer.css';

class Footer extends React.Component {
  state = {height: 0};
  footerContainer = React.createRef();

  setFooterHeight = () => {
    if (this.footerContainer && this.footerContainer.current) {
      this.setState({height: this.footerContainer.current.offsetHeight});
    } else {
      this.setState({height: 0});
    }
  };

  componentDidMount() {
    this.setFooterHeight();
    window.addEventListener('resize', this.setFooterHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setFooterHeight);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="Footer__container--spacer"
          style={{height: this.state.height + 'px'}}
        />
        <div className="row Footer__outer-container--flexbox">
          <div
            className="row Footer__container--elements"
            ref={this.footerContainer}
          >
            <div className="Footer__logo--element">
              <img src={LaesekompasLogo} className="Footer__logo--image" />
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                Læsekompasset hjælper dig med at opdage bøger, der passer dig,
                og inspirerer dig til nye læseoplevelser.
                <br />
                <Link href="/om">Læs mere</Link>
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                Siden er i øjeblikket i beta-version, hvilket betyder, at den
                stadig er under udvikling og at du kan opleve ting, der ikke
                fungerer optimalt endnu.
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                Problemer med teknikken?
                <br />
                <a href="https://kundeservice.dbc.dk" target="_blank">
                  Skriv til DBCs kundeservice
                </a>
                <br />
                <br />
                Spørgsmål om Læsekompasset?
                <br />
                <a href="mailto:laesekompasset@dbc.dk">
                  Skriv til projektledelsen
                </a>
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                DBC a/s
                <br />
                Tempovej 7-11
                <br />
                2750 Ballerup
              </Text>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
