import React from 'react';

/*

<SocialShareButton
  className="ssb-fb" (Not req)
  href={'https://content-first.demo.dbc.dk/lister/' + list.id}
  icon={'glyphicon || icon from media folder'} (Not req)
  hex={'#3b5998'}
  size={40}
  shape="round || square" (Not req)
  txt="Del" (Not req)
  hoverTitle="Del på facebook" (Not req)
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

    return (
      <button
        className={'ssb ' + this.props.className}
        style={buttonStyles}
        title={this.props.hoverTitle || this.props.txt || 'Del'}
      >
        <a
          href={
            'https://www.facebook.com/sharer/sharer.php?display=page&u=' +
            this.props.href
          }
          target="_blank"
        >
          <span style={spanStyles}>
            {this.props.shape !== 'round' && this.props.txt
              ? this.props.txt
              : ''}
          </span>
          <span className={'glyphicon ' + this.props.icon} />
        </a>
      </button>
    );
  }
}
