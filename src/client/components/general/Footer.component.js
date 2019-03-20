import React from 'react';
import Text from '../base/Text';
import T from '../base/T';
import Link from '../general/Link.component';

import LaesekompasLogo from '../svg/LaesekompasLogo.svg';

import './Footer.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sticky: null};
  }

  componentDidMount() {
    setTimeout(() => {}, 200);
    this.handleStickyState();
    window.addEventListener('resize', this.handleStickyState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleStickyState);
  }

  componentDidUpdate() {
    this.handleStickyState();
  }

  handleStickyState = () => {
    const sticky = this.shouldBeSticky();
    if (sticky !== this.state.sticky) {
      this.setState({sticky});
    }
  };

  shouldBeSticky() {
    const footer = this.componentRef;
    const footerHeight = footer ? footer.clientHeight : 200;

    // Check if the content on the page (with a static positioned footer) would have a scrollbar.
    // if true - the footer should keep being static after page content.
    // if false - the content on page is to short and footer should be fixed/stick to the bottom.
    return !(window.innerHeight + footerHeight < document.body.scrollHeight);
  }

  render() {
    const isStickyClass = this.state.sticky ? 'Footer__sticky' : '';

    return (
      <div
        ref={e => (this.componentRef = e)}
        className={`Footer__outer-container--flexbox ${isStickyClass}`}
      >
        <div className="Footer__container--elements p-3 pt-5 pb-md-5">
          <div className="Footer__logo--element mb-1">
            <img src={LaesekompasLogo} className="Footer__logo--image" />
          </div>
          <div className="Footer__element--block">
            <Text type="body" className="mt-3 pr-md-3 pr-lg-3">
              <T component="footer" name="sectionOne" />
              <br />
              <Link href="/om">
                <T component="general" name="readMore" />
              </Link>
            </Text>
          </div>
          <div className="Footer__element--block">
            <Text type="body" className="mt-3 pr-lg-3">
              <T component="footer" name="sectionTwo" />
            </Text>
          </div>
          <div className="Footer__element--block">
            <Text type="body" className="mt-3 pr-md-3 pr-lg-3">
              <T component="footer" name="customerServiceText" />
              <br />
              <a href="https://kundeservice.dbc.dk" target="_blank">
                <T component="footer" name="customerServiceLinkText" />
              </a>
            </Text>
          </div>
          <div className="Footer__element--block">
            <Text type="body" className="mt-3">
              <T component="footer" name="addressCompany" />
              <br />
              <T component="footer" name="addressStreet" />
              <br />
              <T component="footer" name="addressCity" />
            </Text>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
