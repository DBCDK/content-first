import React from 'react';
import './PopupLink.css';

export default class PopupMessage extends React.Component {
  mouseOverFunc = () => {
    this.setState({showPopup: true});
  };
  mouseOutFunc = () => {
    this.setState({showPopup: false});
  };

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    };
  }

  render() {
    const {
      info = '',
      link = '',
      styles = {
        height: '71px',
        width: '273px'
      }
    } = this.props;

    return (
      <div className="PopupMessage" id="popup">
        <div className="Desktop-popup-info" onMouseOver={this.mouseOverFunc}>
          {link}
        </div>
        <div className="Mobile-popup-info" onClick={this.mouseOverFunc}>
          {link}
        </div>

        {this.state.showPopup && (
          <div className="popup-info" style={styles}>
            <div className="popup-backdrop" onClick={this.mouseOutFunc} />
            <div className="popup-info-text" onMouseOut={this.mouseOutFunc}>
              {info}
            </div>
          </div>
        )}
      </div>
    );
  }
}
