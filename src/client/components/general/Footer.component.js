import React from 'react';
import Text from '../base/Text';
import Link from '../general/Link.component';

import LaesekompasLogo from '../svg/LaesekompasLogo.svg';

import './Footer.css';

function Block1() {
  return (
    <React.Fragment>
      <img src={LaesekompasLogo} className="laesekompas-logo"/>
      <Text type="body" className="mt1">
        Læsekompasset hjælper dig med at opdage bøger, der passer dig, og inspirerer dig til nye læseoplevelser.<br/>
        <Link href="/om">Læs mere</Link>
      </Text>
    </React.Fragment>
  );
}

function Block2() {
  return (
    <React.Fragment>
      <Text type="body" className="mt1">Siden er i øjeblikket i beta-version, hvilket betyder, at den stadig er under udvikling
            og at du kan opleve ting, der ikke fungerer optimalt endnu.</Text>
    </React.Fragment>
  );
}

function Block3() {
  return (
    <React.Fragment>
      <Text type="body" className="mt1">
        Problemer med teknikken?<br/>
        <a href="https://kundeservice.dbc.dk" target="_blank">Skriv til DBCs kundeservice</a><br/>
        <br/>
        Spørgsmål om Læsekompasset?<br/>
        <a href="mailto:laesekompasset@dbc.dk">Skriv til projektledelsen</a>
      </Text>
    </React.Fragment>
  );
}

function Block4() {
  return (
    <React.Fragment>
      <Text type="body" className="mt1">
        DBC a/s<br/>
        Tempovej 7-11<br/>
        2750 Ballerup
      </Text>
    </React.Fragment>
  );
}

function Footer() {
  return (
    <React.Fragment>
      <div className="footer-container-spacer"></div>
      <div className="footer-container">
        <div className="row">
          <div className="col footer-element first-footer">
            <Block1/>
          </div>
          <div className="col footer-element second-footer">
            <Block2/>
          </div>
          <div className="avoid-orphans-row">
            <div className="col footer-element">
              <Block3/>
            </div>
            <div className="col footer-element">
              <Block4/>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Footer;
