import React from 'react';

const ProfileImage = ({src, name, type = 'card', className = '', size}) => (
  <div className={`profile-${type} ${className}`}>
    <span
      className="profile-image small round"
      style={{width: size, height: size}}
    >
      <img className="cover" src={src} alt={name} />
    </span>
    <h4 className="profile-name t-body h4 mt0 mb0">{name}</h4>
  </div>
);

export default ProfileImage;
