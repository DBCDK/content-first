import React from 'react';
import Text from '../base/Text';
import Link from '../general/Link.component';

import LaesekompasLogo from '../svg/LaesekompasLogo.svg';

import './Footer.css';

class Footer extends React.Component {
  state = {height: 0};
  footerContainer = React.createRef();

  setFooterHeight() {
    if (this.footer && this.footerContainer && this.footerContainer.current) {
      this.setState({height: this.footerContainer.current.offsetHeight});
    } else {
      this.setState({height: 0});
    }
  }

  componentDidMount() {
    this.setFooterHeight();
    window.addEventListener('resize', this.setFooterHeight.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setFooterHeight.bind(this));
  }

  render() {
    function Block1() {
      return (
        <Text type="body" className="mt1">
          Læsekompasset hjælper dig med at opdage bøger, der passer dig, og
          inspirerer dig til nye læseoplevelser.
          <br />
          <Link href="/om">Læs mere</Link>
        </Text>
      );
    }
    function Block2() {
      return (
        <Text type="body" className="mt1">
          Siden er i øjeblikket i beta-version, hvilket betyder, at den stadig
          er under udvikling og at du kan opleve ting, der ikke fungerer
          optimalt endnu.
        </Text>
      );
    }
    function Block3() {
      return (
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
          <a href="mailto:laesekompasset@dbc.dk">Skriv til projektledelsen</a>
        </Text>
      );
    }
    function Block4() {
      return (
        <Text type="body" className="mt1">
          DBC a/s
          <br />
          Tempovej 7-11
          <br />
          2750 Ballerup
        </Text>
      );
    }
    return (
      <React.Fragment>
        <div
          className="footer-container-spacer"
          style={{height: this.state.height + 'px'}}
        />
        <div className="row outer-footer-container">
          <div className="row footer-container" ref={this.footerContainer}>
            <div className="logo-element-container">
              <img src={LaesekompasLogo} className="laesekompas-logo" />
            </div>
            <div className="col footer-element first-footer">
              <Block1 />
            </div>
            <div className="col footer-element second-footer">
              <Block2 />
            </div>
            <div className="col footer-element">
              <Block3 />
            </div>
            <div className="col footer-element">
              <Block4 />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
