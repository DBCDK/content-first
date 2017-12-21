import React from 'react';

const ProfileImage = ({src, name, type = 'card', className = ''}) => (
  <div className={`profile-${type} ${className}`}>
    <span className="profile-image small round">
      <img className="cover" src={src} alt={name} />
    </span>
    <p className="profile-name t-body h4">{name}</p>
  </div>
);

export default ProfileImage;
