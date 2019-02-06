import React from 'react';
import Text from '../base/Text';
import T from '../base/T';
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
                <T component="footer" name="sectionOne" />
                <br />
                <Link href="/om">
                  <T component="general" name="readMore" />
                </Link>
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                <T component="footer" name="sectionTwo" />
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                <T component="footer" name="customerServiceText" />
                <br />
                <a href="https://kundeservice.dbc.dk" target="_blank">
                  <T component="footer" name="customerServiceLinkText" />
                </a>
                <br />
                <br />
                <T component="footer" name="writeToManagementText" />
                <br />
                <a href="mailto:laesekompasset@dbc.dk">
                  <T component="footer" name="writeToManagementLinkText" />
                </a>
              </Text>
            </div>
            <div className="col Footer__element--block">
              <Text type="body" className="mt1">
                <T component="footer" name="addressCompany" />
                <br />
                <T component="footer" name="addressStreet" />
                <br />
                <T component="footer" name="addressCity" />
              </Text>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
