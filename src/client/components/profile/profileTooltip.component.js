import React from 'react';
import '../../style/components/profileTooltip.css';

class ProfileTooltip extends React.Component {
  render() {
    return (
      <div className={`profile-tooltip ${this.props.isVisible ? 'is-visible' : ''}`} >
        <div className="profile-tooltip-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ProfileTooltip;
