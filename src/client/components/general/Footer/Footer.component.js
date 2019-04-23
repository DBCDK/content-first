import React from 'react';
import Text from '../../base/Text';
import T from '../../base/T';

import Link from '../../general/Link.component';

import LaesekompasLogo from './LaesekompasLogo.svg';

import './Footer.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {sticky: null};
  }

  componentDidMount() {
    this.handleStickyState();
    this.observeDom();
    window.addEventListener('resize', this.handleStickyState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleStickyState);
  }

  componentDidUpdate() {
    // check sticky state
    this.handleStickyState();
  }

  handleStickyState = () => {
    const sticky = this.shouldBeSticky();
    if (sticky !== this.state.sticky) {
      this.setState({sticky});
    }
  };

  shouldBeSticky() {
    const contentHeight = this.contentLine
      ? this.contentLine.offsetTop
      : document.body.scrollHeight;

    return contentHeight + 200 < window.innerHeight;
  }

  observeDom = () => {
    const targetNode = document.getElementById('root');
    const observer = new MutationObserver(() => {
      this.handleStickyState();
    });
    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true
    });
  };

  render() {
    const sticky = this.state.sticky;
    const isStickyClass = sticky ? 'Footer__sticky' : '';

    if (sticky === null) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Footer__ghost" ref={e => (this.contentLine = e)} />
        <div className={`Footer__outer-container--flexbox ${isStickyClass}`}>
          <div className="Footer__container--elements p-3 pt-5 pb-md-5">
            <div className="Footer__logo--element mb-1">
              <img
                src={LaesekompasLogo}
                className="Footer__logo--image"
                alt=""
              />
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
                <a
                  href="https://kundeservice.dbc.dk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
      </React.Fragment>
    );
  }
}

export default Footer;
