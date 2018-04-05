import React from 'react';

/*
<SocialShareButton
  className="ssb-fb"
  href="www.example.dk"
  icon={'glyphicon-share'}
  hex={'#3b5998'}
  size={40}
  shape="round"
/>

<meta property="og:title" content="Fletpdf.dk" />
<meta property="og:type" content="service" />
<meta property="og:url" content="https://www.fletpdf.dk" />
<meta property="og:image" content="https://www.fletpdf.dk/img/cover1_large.jpg" />
<meta property="og:description" content="Upload, håndter og sammensæt flere pdf filer til en, hurtigt, sikkert, nemt og selvfølgelig helt gratis!" />
<meta property="og:local" content="da_DK" />
*/

export default class SocialShareButton extends React.Component {
  render() {
    const styles = {
      backgroundColor: this.props.hex,
      height: this.props.size + 'px',
      width: this.props.size + 'px',
      lineHeight: this.props.size + 'px',
      fontSize: this.props.size / 2.5 + 'px'
    };

    styles.borderRadius = this.props.shape === 'round' ? '50%' : '5px';

    return (
      <button className={'ssb ' + this.props.className} style={styles}>
        <a
          href={
            'https://www.facebook.com/sharer/sharer.php?display=page&u=' +
            this.props.href
          }
          target="_blank"
        >
          <span className={'glyphicon ' + this.props.icon} />
        </a>
      </button>
    );
  }
}
