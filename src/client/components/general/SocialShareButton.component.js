import React from 'react';

/*
<SocialShareButton
  className="ssb-fb" (Not req)
  href={'https://myurltoshare.dk/lister/1234567 || null} (Not req)
  icon={'glyphicon || icon from media folder'} (Not req)
  hex={'#3b5998'}
  size={40}
  shape="round || square" (Not req)
  txt="Del" (Not req)
  hoverTitle="Del på facebook" (Not req)
  stamp="123456789" (not req) (uniq cash prevent key for test)
  status={'active || passive || disabled'} (Not req)
  onClick={() => this.props.clickMe()} (Not req)
/>
*/

export default class SocialShareButton extends React.Component {
  render() {
    const buttonStyles = {
      backgroundColor: this.props.hex,
      height: this.props.size + 'px',
      lineHeight: this.props.size + 'px',
      fontSize: this.props.size / 2.5 + 'px'
    };

    const spanStyles = {
      fontWeight: 'bold',
      marginRight: this.props.txt ? this.props.size / 3 + 'px' : '0px'
    };

    buttonStyles.borderRadius = this.props.shape === 'round' ? '50%' : '5px';
    buttonStyles.width =
      this.props.shape !== 'round' && this.props.txt
        ? 'auto'
        : this.props.size + 'px';
    buttonStyles.paddingLeft =
      this.props.shape !== 'round' && this.props.txt
        ? this.props.size / 2 + 'px'
        : '0px';
    buttonStyles.paddingRight =
      this.props.shape !== 'round' && this.props.txt
        ? this.props.size / 2 + 'px'
        : '0px';
    buttonStyles.backgroundColor =
      this.props.status === 'passive' ? '#ccc' : this.props.hex;

    const ts = this.props.stamp ? this.props.stamp : Date.now();

    return (
      <a
        href={
          this.props.href
            ? 'https://www.facebook.com/sharer/sharer.php?display=page&u=' +
              this.props.href +
              '?' +
              ts
            : null
        }
        target="_blank"
        onClick={this.props.href ? null : this.props.onClick}
      >
        <button
          className={'ssb ' + this.props.className}
          style={buttonStyles}
          title={this.props.hoverTitle || this.props.txt || 'Del'}
        >
          <span style={spanStyles}>
            {this.props.shape !== 'round' && this.props.txt
              ? this.props.txt
              : ''}
          </span>
          <span className={'glyphicon ' + this.props.icon} />
        </button>
      </a>
    );
  }
}
