import React from 'react';
import Text from '../../base/Text';
import T from '../../base/T';

import facebook from './facebook.svg';

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
    const footerHeight =
      this.footerContainer && this.footerContainer.clientHeight
        ? this.footerContainer.clientHeight
        : 0;
    return contentHeight + footerHeight + 50 < window.innerHeight;
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
    const isStickyClass = sticky ? 'sticky' : '';

    if (sticky === null) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="footer__ghost" ref={e => (this.contentLine = e)} />
        <div
          className={`footer__outer-container ${isStickyClass}`}
          ref={e => (this.footerContainer = e)}
        >
          <div className="footer__container--elements">
            <div className="footer__element ">
              <Text type="body" className="footer_span_container ">
                <a
                  href="https://kundeservice.dbc.dk/lk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T component="footer" name="feedback" />
                </a>

                <a href="/om" target="_blank" rel="noopener noreferrer">
                  <T component="footer" name="about" />
                </a>

                <a
                  href="/vilkaar-og-betingelser"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T component="footer" name="policy" />
                </a>
                <a
                  href="/privatlivspolitik"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T component="footer" name="privatlivspolitik" />
                </a>
              </Text>
            </div>

            <div className="footer__element">
              <Text type="body" className="footer_span_container">
                <span>
                  <T component="footer" name="addressCompany" />
                </span>

                <span>
                  <T component="footer" name="addressStreet" />
                </span>

                <span>
                  <T component="footer" name="addressCity" />
                </span>
                <a href="/was" target="_blank" rel="noopener noreferrer">
                  <T component="footer" name="tilgængelighedserklæring" />
                </a>
              </Text>
            </div>
            <div className="footer__element ">
              <a
                className="facebook_footer_container"
                href="https://www.facebook.com/laesekompas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} width="25" height="auto" alt="" />

                <Text type="body" className="footer_facebook_text">
                  <T component="footer" name="facebook" />
                </Text>
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
